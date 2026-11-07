import bcrypt from 'bcryptjs';
import { UserModel } from '../models/userModel.js';
import {
  generateTokens,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from '../utils/token.js';
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../utils/errors.js';

export class AuthService {
  /**
   * Register a new Student or Instructor
   *
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} params.firstName
   * @param {string} params.lastName
   * @param {string} [params.role='student']
   */
  static async register({ email, password, firstName, lastName, role = 'student' }) {
    // 1. Enforce allowed self-registration roles (prevent registering as admin)
    const targetRoleName = role.toLowerCase();
    if (!['student', 'instructor'].includes(targetRoleName)) {
      throw new BadRequestError('Self-registration is only available for student and instructor roles');
    }

    // 2. Check if email already in use
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(`An account with email '${email}' is already registered`);
    }

    // 3. Find target role ID
    const roleRecord = await UserModel.findRoleByName(targetRoleName);
    if (!roleRecord) {
      throw new NotFoundError(`System role '${targetRoleName}' not found`);
    }

    // 4. Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Create user and profile in atomic transaction
    const newUser = await UserModel.create({
      email,
      passwordHash,
      roleId: roleRecord.id,
      profileData: {
        firstName,
        lastName,
        headline: targetRoleName === 'instructor' ? 'Platform Instructor' : 'Passionate Developer',
      },
    });

    // 6. Generate session JWT tokens
    const tokens = generateTokens({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.profile.first_name,
        lastName: newUser.profile.last_name,
        avatarUrl: newUser.profile.avatar_url,
      },
      tokens,
    };
  }

  /**
   * Login with email and password
   *
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  static async login({ email, password }) {
    // 1. Find user with password hash
    const user = await UserModel.findWithPasswordByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 2. Check if account is active
    if (!user.is_active) {
      throw new UnauthorizedError('This account is disabled. Please contact platform administration.');
    }

    // 3. Compare password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 4. Update last login timestamp asynchronously
    UserModel.updateLastLogin(user.id).catch((err) =>
      console.error('[AuthService] Failed to update last login:', err.message)
    );

    // 5. Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
      },
      tokens,
    };
  }

  /**
   * Change user password
   *
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.currentPassword
   * @param {string} params.newPassword
   */
  static async changePassword({ userId, currentPassword, newPassword }) {
    const user = await UserModel.findWithPasswordById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password and save
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(userId, newPasswordHash);

    return { message: 'Password changed successfully' };
  }

  /**
   * Request password reset token
   *
   * @param {string} email
   */
  static async forgotPassword(email) {
    const user = await UserModel.findWithPasswordByEmail(email);

    // Timing-safe response: do not expose whether email exists
    if (!user) {
      return {
        message: 'If an account matches this email, a password reset link has been generated.',
        resetToken: null,
      };
    }

    const resetToken = generatePasswordResetToken(user);
    return {
      message: 'If an account matches this email, a password reset link has been generated.',
      resetToken, // Returned in API for development & testing
    };
  }

  /**
   * Reset password using single-use reset token
   *
   * @param {Object} params
   * @param {string} params.token
   * @param {string} params.newPassword
   */
  static async resetPassword({ token, newPassword }) {
    // 1. Decode token to find user ID
    let decoded;
    try {
      // Decode without verification first to extract payload id
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token structure');
      decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    } catch (_) {
      throw new BadRequestError('Malformed password reset token');
    }

    if (!decoded || !decoded.id) {
      throw new BadRequestError('Invalid reset token payload');
    }

    // 2. Fetch user's current password hash
    const user = await UserModel.findWithPasswordById(decoded.id);
    if (!user) {
      throw new NotFoundError('User associated with this reset link no longer exists');
    }

    // 3. Verify token with user's current password hash composite
    verifyPasswordResetToken(token, user.password_hash);

    // 4. Hash new password and update
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(user.id, newPasswordHash);

    return {
      message: 'Password reset successfully. You may now log in with your new password.',
    };
  }

  /**
   * Refresh expired access token using valid refresh token
   *
   * @param {string} refreshToken
   */
  static async refreshAccessToken(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(decoded.id);

    if (!user || !user.is_active) {
      throw new UnauthorizedError('Invalid session. User account inactive or removed.');
    }

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
      },
    };
  }
}

export default AuthService;

