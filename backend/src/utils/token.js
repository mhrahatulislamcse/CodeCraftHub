import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { UnauthorizedError } from './errors.js';

/**
 * Generate Access and Refresh JWT Tokens
 *
 * @param {Object} user - User payload { id, email, role }
 * @returns {{ accessToken: string, refreshToken: string, expiresIn: string }}
 */
export const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
  };
};

/**
 * Verify Access Token
 *
 * @param {string} token - Bearer JWT string
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token has expired. Please refresh your session.');
    }
    throw new UnauthorizedError('Invalid access token');
  }
};

/**
 * Verify Refresh Token
 *
 * @param {string} token - Refresh token string
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh token has expired. Please log in again.');
    }
    throw new UnauthorizedError('Invalid refresh token');
  }
};

/**
 * Generate a single-use Password Reset Token
 * Uses a secret composite of the system secret + the user's current password hash.
 * This guarantees the token self-invalidates immediately once the password changes.
 *
 * @param {Object} user - { id, email, password_hash }
 * @returns {string} Signed reset token valid for 1 hour
 */
export const generatePasswordResetToken = (user) => {
  const secret = `${config.jwt.secret}-${user.password_hash}`;
  return jwt.sign(
    { id: user.id, email: user.email, purpose: 'password_reset' },
    secret,
    { expiresIn: '1h' }
  );
};

/**
 * Verify Password Reset Token against the user's current password hash
 *
 * @param {string} token - Reset token
 * @param {string} currentPasswordHash - The user's current password hash
 * @returns {Object} Decoded token payload
 */
export const verifyPasswordResetToken = (token, currentPasswordHash) => {
  const secret = `${config.jwt.secret}-${currentPasswordHash}`;
  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.purpose !== 'password_reset') {
      throw new UnauthorizedError('Invalid token purpose');
    }
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Password reset link has expired. Please request a new one.');
    }
    throw new UnauthorizedError('Invalid or already used password reset link.');
  }
};

export default {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};

