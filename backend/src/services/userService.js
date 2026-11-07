import { UserModel } from '../models/userModel.js';
import { NotFoundError } from '../utils/errors.js';

export class UserService {
  /**
   * Get current authenticated user profile
   * @param {string} userId
   */
  static async getMe(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  /**
   * Update current authenticated user profile
   * @param {string} userId
   * @param {Object} updateData
   */
  static async updateMe(userId, updateData) {
    const updated = await UserModel.updateProfile(userId, updateData);
    if (!updated) {
      throw new NotFoundError('User profile not found');
    }
    return updated;
  }

  /**
   * Get public profile by User ID
   * @param {string} userId
   */
  static async getUserById(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Return sanitized public profile
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      headline: user.headline,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      githubUrl: user.github_url,
      linkedinUrl: user.linkedin_url,
      websiteUrl: user.website_url,
      role: user.role,
      learningGoals: user.learning_goals,
      preferredDifficulty: user.preferred_difficulty,
      createdAt: user.created_at,
    };
  }
}

export default UserService;

