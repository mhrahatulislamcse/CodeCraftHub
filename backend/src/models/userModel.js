import { pool, getClient } from '../config/db.js';

export class UserModel {
  /**
   * Find role by name ('student', 'instructor', 'admin')
   * @param {string} roleName
   */
  static async findRoleByName(roleName) {
    const res = await pool.query(
      `SELECT id, name, description FROM roles WHERE name = $1;`,
      [roleName.toLowerCase()]
    );
    return res.rows[0] || null;
  }

  /**
   * Find user with password hash by email (for login only)
   * @param {string} email
   */
  static async findWithPasswordByEmail(email) {
    const query = `
      SELECT 
        u.id, 
        u.email, 
        u.password_hash, 
        u.role_id, 
        r.name AS role, 
        u.is_active,
        u.email_verified,
        p.first_name,
        p.last_name,
        p.avatar_url
      FROM users u
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE LOWER(u.email) = LOWER($1);
    `;
    const res = await pool.query(query, [email.trim()]);
    return res.rows[0] || null;
  }

  /**
   * Find user with password hash by ID (for password change/reset only)
   * @param {string} id
   */
  static async findWithPasswordById(id) {
    const query = `
      SELECT 
        u.id, 
        u.email, 
        u.password_hash, 
        u.role_id, 
        r.name AS role, 
        u.is_active
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1;
    `;
    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  }

  /**
   * Find user by ID (Safe - never returns password hash)
   * @param {string} id
   */
  static async findById(id) {
    const query = `
      SELECT 
        u.id, 
        u.email, 
        u.role_id, 
        r.name AS role, 
        u.is_active,
        u.email_verified,
        u.last_login_at,
        u.created_at,
        u.updated_at,
        p.first_name,
        p.last_name,
        p.headline,
        p.bio,
        p.avatar_url,
        p.github_url,
        p.linkedin_url,
        p.website_url,
        p.learning_goals,
        p.preferred_difficulty,
        p.notification_email,
        p.notification_in_app
      FROM users u
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id = $1;
    `;
    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  }

  /**
   * Find user by Email (Safe - never returns password hash)
   * @param {string} email
   */
  static async findByEmail(email) {
    const query = `
      SELECT 
        u.id, 
        u.email, 
        u.role_id, 
        r.name AS role, 
        u.is_active,
        u.email_verified,
        p.first_name,
        p.last_name,
        p.avatar_url
      FROM users u
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE LOWER(u.email) = LOWER($1);
    `;
    const res = await pool.query(query, [email.trim()]);
    return res.rows[0] || null;
  }

  /**
   * Create a new User with Profile in an atomic transaction
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.passwordHash
   * @param {number} params.roleId
   * @param {Object} params.profileData
   */
  static async create({ email, passwordHash, roleId, profileData = {} }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Insert user
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role_id, is_active, email_verified)
         VALUES ($1, $2, $3, true, false)
         RETURNING id, email, role_id, is_active, created_at;`,
        [email.trim().toLowerCase(), passwordHash, roleId]
      );
      const newUser = userRes.rows[0];

      // 2. Insert user profile
      const profileRes = await client.query(
        `INSERT INTO user_profiles (
          user_id, 
          first_name, 
          last_name, 
          headline, 
          bio, 
          avatar_url,
          learning_goals,
          preferred_difficulty
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`,
        [
          newUser.id,
          profileData.firstName || 'Developer',
          profileData.lastName || 'Learner',
          profileData.headline || 'Full-Stack Developer in Training',
          profileData.bio || '',
          profileData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
          profileData.learningGoals || [],
          profileData.preferredDifficulty || 'Beginner',
        ]
      );

      await client.query('COMMIT');

      // Fetch role name
      const roleRes = await pool.query('SELECT name FROM roles WHERE id = $1;', [roleId]);
      const roleName = roleRes.rows[0]?.name || 'student';

      return {
        ...newUser,
        role: roleName,
        profile: profileRes.rows[0],
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Update password hash
   * @param {string} userId
   * @param {string} passwordHash
   */
  static async updatePassword(userId, passwordHash) {
    const res = await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id;`,
      [passwordHash, userId]
    );
    return res.rows[0] || null;
  }

  /**
   * Update last login timestamp
   * @param {string} userId
   */
  static async updateLastLogin(userId) {
    await pool.query(
      `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1;`,
      [userId]
    );
  }

  /**
   * Update User Profile details
   * @param {string} userId
   * @param {Object} data
   */
  static async updateProfile(userId, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowedFields = {
      firstName: 'first_name',
      lastName: 'last_name',
      headline: 'headline',
      bio: 'bio',
      avatarUrl: 'avatar_url',
      githubUrl: 'github_url',
      linkedinUrl: 'linkedin_url',
      websiteUrl: 'website_url',
      learningGoals: 'learning_goals',
      preferredDifficulty: 'preferred_difficulty',
      notificationEmail: 'notification_email',
      notificationInApp: 'notification_in_app',
    };

    for (const [camelKey, dbCol] of Object.entries(allowedFields)) {
      if (data[camelKey] !== undefined) {
        fields.push(`${dbCol} = $${idx}`);
        values.push(data[camelKey]);
        idx++;
      }
    }

    if (fields.length === 0) {
      return this.findById(userId);
    }

    values.push(userId);
    const sql = `
      UPDATE user_profiles
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${idx}
      RETURNING *;
    `;

    await pool.query(sql, values);
    return this.findById(userId);
  }

  /**
   * Find all users with pagination, role filtering, and search (Admin)
   *
   * @param {Object} query - { page, limit, role, search }
   */
  static async findAll({ page = 1, limit = 20, role, search } = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (role && role !== 'all') {
      conditions.push(`r.name = $${idx}`);
      values.push(role.toLowerCase());
      idx++;
    }

    if (search && search.trim()) {
      conditions.push(`(
        u.email ILIKE $${idx} OR 
        p.first_name ILIKE $${idx} OR 
        p.last_name ILIKE $${idx}
      )`);
      values.push(`%${search.trim()}%`);
      idx++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*)::INTEGER AS total 
      FROM users u
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      ${whereClause};
    `;
    const countRes = await pool.query(countSql, values);
    const totalRecords = countRes.rows[0].total;

    const currentPage = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (currentPage - 1) * pageLimit;

    const sql = `
      SELECT 
        u.id,
        u.email,
        r.name AS role,
        u.is_active,
        u.email_verified,
        u.created_at,
        u.last_login_at,
        p.first_name,
        p.last_name,
        p.headline,
        p.avatar_url
      FROM users u
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1};
    `;
    values.push(pageLimit, offset);
    const res = await pool.query(sql, values);

    return {
      users: res.rows,
      pagination: {
        totalRecords,
        currentPage,
        pageLimit,
        totalPages: Math.ceil(totalRecords / pageLimit),
      },
    };
  }

  /**
   * Update user role (Admin)
   *
   * @param {string} userId
   * @param {string} newRoleName
   */
  static async updateRole(userId, newRoleName) {
    const role = await this.findRoleByName(newRoleName);
    if (!role) {
      throw new Error(`Role "${newRoleName}" not recognized.`);
    }

    await pool.query(
      `UPDATE users SET role_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
      [role.id, userId]
    );

    return this.findById(userId);
  }

  /**
   * Update user active status (Admin)
   *
   * @param {string} userId
   * @param {boolean} isActive
   */
  static async updateStatus(userId, isActive) {
    await pool.query(
      `UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
      [isActive, userId]
    );

    return this.findById(userId);
  }

  /**
   * Get Platform System Analytics (Admin)
   */
  static async getPlatformStats() {
    const sql = `
      SELECT 
        (SELECT COUNT(*)::INTEGER FROM users) AS total_users,
        (SELECT COUNT(*)::INTEGER FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'student') AS total_students,
        (SELECT COUNT(*)::INTEGER FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'instructor') AS total_instructors,
        (SELECT COUNT(*)::INTEGER FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'admin') AS total_admins,
        (SELECT COUNT(*)::INTEGER FROM courses) AS total_courses,
        (SELECT COUNT(*)::INTEGER FROM courses WHERE is_published = true) AS published_courses,
        (SELECT COUNT(*)::INTEGER FROM courses WHERE is_published = false) AS draft_courses,
        (SELECT COUNT(*)::INTEGER FROM enrollments) AS total_enrollments,
        (SELECT COUNT(*)::INTEGER FROM certificates) AS total_certificates_issued,
        (SELECT COUNT(*)::INTEGER FROM lessons) AS total_lessons;
    `;
    const res = await pool.query(sql);
    return res.rows[0];
  }
}

export default UserModel;

