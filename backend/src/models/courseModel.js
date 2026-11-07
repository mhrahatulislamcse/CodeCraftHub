import { pool, getClient } from '../config/db.js';

export class CourseModel {
  /**
   * Find courses with search, filters, sorting, and pagination
   *
   * @param {Object} options
   * @param {string} [options.search]
   * @param {string} [options.categorySlug]
   * @param {string} [options.categoryId]
   * @param {string} [options.difficulty]
   * @param {string} [options.instructorId]
   * @param {boolean} [options.isPublished]
   * @param {string} [options.sortBy='created_at']
   * @param {string} [options.sortOrder='DESC']
   * @param {number} [options.page=1]
   * @param {number} [options.limit=12]
   */
  static async findAll({
    search,
    categorySlug,
    categoryId,
    difficulty,
    instructorId,
    isPublished,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    page = 1,
    limit = 12,
  } = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    // Filter by publish status
    if (isPublished !== undefined) {
      conditions.push(`c.is_published = $${idx}`);
      values.push(isPublished);
      idx++;
    }

    // Filter by Instructor
    if (instructorId) {
      conditions.push(`c.instructor_id = $${idx}`);
      values.push(instructorId);
      idx++;
    }

    // Filter by Difficulty
    if (difficulty && difficulty !== 'All Levels') {
      conditions.push(`c.difficulty_level = $${idx}`);
      values.push(difficulty);
      idx++;
    }

    // Search query across title and description
    if (search && search.trim()) {
      conditions.push(`(c.title ILIKE $${idx} OR c.description ILIKE $${idx})`);
      values.push(`%${search.trim()}%`);
      idx++;
    }

    // Filter by Category
    if (categoryId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM course_categories cc 
        WHERE cc.course_id = c.id AND cc.category_id = $${idx}
      )`);
      values.push(categoryId);
      idx++;
    } else if (categorySlug) {
      conditions.push(`EXISTS (
        SELECT 1 FROM course_categories cc 
        JOIN categories cat ON cat.id = cc.category_id
        WHERE cc.course_id = c.id AND cat.slug = $${idx}
      )`);
      values.push(categorySlug);
      idx++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Valid sort columns
    const allowedSortColumns = {
      created_at: 'c.created_at',
      rating: 'c.rating_average',
      enrollments: 'c.enrollment_count',
      hours: 'c.estimated_hours',
      title: 'c.title',
    };
    const orderColumn = allowedSortColumns[sortBy] || 'c.created_at';
    const direction = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as total FROM courses c ${whereClause};`;
    const countRes = await pool.query(countSql, values);
    const totalRecords = parseInt(countRes.rows[0].total, 10);

    // Pagination math
    const currentPage = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (currentPage - 1) * pageLimit;

    // Data query with aggregated relations
    const dataSql = `
      SELECT 
        c.id,
        c.title,
        c.slug,
        c.description,
        c.thumbnail_url,
        c.difficulty_level,
        c.estimated_hours,
        c.is_published,
        c.published_at,
        c.rating_average,
        c.rating_count,
        c.enrollment_count,
        c.created_at,
        -- Instructor information
        json_build_object(
          'id', u.id,
          'firstName', p.first_name,
          'lastName', p.last_name,
          'headline', p.headline,
          'avatarUrl', p.avatar_url
        ) AS instructor,
        -- Categories list
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', cat.id, 'name', cat.name, 'slug', cat.slug, 'icon', cat.icon))
            FROM course_categories cc
            JOIN categories cat ON cat.id = cc.category_id
            WHERE cc.course_id = c.id
          ),
          '[]'::json
        ) AS categories,
        -- Skills list
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', sk.id, 'name', sk.name, 'slug', sk.slug, 'level', cs.skill_level_gained))
            FROM course_skills cs
            JOIN skills sk ON sk.id = cs.skill_id
            WHERE cs.course_id = c.id
          ),
          '[]'::json
        ) AS skills,
        -- Lesson count & total duration
        (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lesson_count
      FROM courses c
      JOIN users u ON u.id = c.instructor_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      ${whereClause}
      ORDER BY ${orderColumn} ${direction}
      LIMIT $${idx} OFFSET $${idx + 1};
    `;

    values.push(pageLimit, offset);
    const dataRes = await pool.query(dataSql, values);

    return {
      courses: dataRes.rows,
      pagination: {
        totalRecords,
        currentPage,
        pageLimit,
        totalPages: Math.ceil(totalRecords / pageLimit),
        hasNextPage: currentPage * pageLimit < totalRecords,
        hasPrevPage: currentPage > 1,
      },
    };
  }

  /**
   * Find course by ID or Slug with complete curriculum syllabus
   *
   * @param {string} idOrSlug - UUID or unique course slug
   */
  static async findByIdOrSlug(idOrSlug) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const condition = isUuid ? 'c.id = $1' : 'c.slug = $1';

    const sql = `
      SELECT 
        c.id,
        c.title,
        c.slug,
        c.description,
        c.thumbnail_url,
        c.difficulty_level,
        c.estimated_hours,
        c.is_published,
        c.published_at,
        c.rating_average,
        c.rating_count,
        c.enrollment_count,
        c.learning_objectives,
        c.prerequisites,
        c.created_at,
        c.updated_at,
        -- Instructor information
        json_build_object(
          'id', u.id,
          'email', u.email,
          'firstName', p.first_name,
          'lastName', p.last_name,
          'headline', p.headline,
          'bio', p.bio,
          'avatarUrl', p.avatar_url,
          'githubUrl', p.github_url,
          'linkedinUrl', p.linkedin_url
        ) AS instructor,
        -- Categories list
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', cat.id, 'name', cat.name, 'slug', cat.slug, 'icon', cat.icon))
            FROM course_categories cc
            JOIN categories cat ON cat.id = cc.category_id
            WHERE cc.course_id = c.id
          ),
          '[]'::json
        ) AS categories,
        -- Skills list
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', sk.id, 'name', sk.name, 'slug', sk.slug, 'level', cs.skill_level_gained))
            FROM course_skills cs
            JOIN skills sk ON sk.id = cs.skill_id
            WHERE cs.course_id = c.id
          ),
          '[]'::json
        ) AS skills,
        -- Syllabus lessons
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', l.id,
                'title', l.title,
                'slug', l.slug,
                'orderIndex', l.order_index,
                'durationMinutes', l.duration_minutes,
                'isFreePreview', l.is_free_preview,
                'description', l.description
              )
              ORDER BY l.order_index ASC
            )
            FROM lessons l
            WHERE l.course_id = c.id
          ),
          '[]'::json
        ) AS lessons
      FROM courses c
      JOIN users u ON u.id = c.instructor_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE ${condition};
    `;

    const res = await pool.query(sql, [idOrSlug]);
    return res.rows[0] || null;
  }

  /**
   * Create a new Course with Category & Skill associations in a single transaction
   *
   * @param {Object} data
   */
  static async create(data) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const courseSql = `
        INSERT INTO courses (
          title,
          slug,
          description,
          instructor_id,
          thumbnail_url,
          difficulty_level,
          estimated_hours,
          is_published,
          published_at,
          learning_objectives,
          prerequisites
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;

      const isPublished = Boolean(data.isPublished);
      const publishedAt = isPublished ? new Date() : null;

      const courseRes = await client.query(courseSql, [
        data.title,
        data.slug,
        data.description,
        data.instructorId,
        data.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
        data.difficultyLevel || 'Beginner',
        data.estimatedHours || 0,
        isPublished,
        publishedAt,
        data.learningObjectives || [],
        data.prerequisites || [],
      ]);

      const newCourse = courseRes.rows[0];

      // Insert category mappings
      if (Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
        for (const catId of data.categoryIds) {
          await client.query(
            `INSERT INTO course_categories (course_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
            [newCourse.id, catId]
          );
        }
      }

      // Insert skill mappings
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        for (const skill of data.skills) {
          const skillId = typeof skill === 'string' ? skill : skill.skillId;
          const level = typeof skill === 'object' && skill.level ? skill.level : 'Intermediate';
          await client.query(
            `INSERT INTO course_skills (course_id, skill_id, skill_level_gained) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`,
            [newCourse.id, skillId, level]
          );
        }
      }

      await client.query('COMMIT');
      return this.findByIdOrSlug(newCourse.id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Update Course details
   *
   * @param {string} id
   * @param {Object} data
   */
  static async update(id, data) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const allowedFields = {
        title: 'title',
        slug: 'slug',
        description: 'description',
        thumbnailUrl: 'thumbnail_url',
        difficultyLevel: 'difficulty_level',
        estimatedHours: 'estimated_hours',
        isPublished: 'is_published',
        learningObjectives: 'learning_objectives',
        prerequisites: 'prerequisites',
      };

      const sets = [];
      const values = [];
      let idx = 1;

      for (const [key, col] of Object.entries(allowedFields)) {
        if (data[key] !== undefined) {
          sets.push(`${col} = $${idx}`);
          values.push(data[key]);
          idx++;
        }
      }

      if (data.isPublished === true) {
        sets.push(`published_at = COALESCE(published_at, CURRENT_TIMESTAMP)`);
      }

      if (sets.length > 0) {
        values.push(id);
        const updateSql = `
          UPDATE courses 
          SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = $${idx}
          RETURNING id;
        `;
        await client.query(updateSql, values);
      }

      // Update categories if supplied
      if (Array.isArray(data.categoryIds)) {
        await client.query(`DELETE FROM course_categories WHERE course_id = $1;`, [id]);
        for (const catId of data.categoryIds) {
          await client.query(
            `INSERT INTO course_categories (course_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
            [id, catId]
          );
        }
      }

      await client.query('COMMIT');
      return this.findByIdOrSlug(id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Delete course
   *
   * @param {string} id
   */
  static async delete(id) {
    const res = await pool.query(`DELETE FROM courses WHERE id = $1 RETURNING id, title;`, [id]);
    return res.rows[0] || null;
  }

  /**
   * List all categories with course count
   */
  static async getCategories() {
    const sql = `
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.icon, 
        c.description, 
        c.display_order,
        COUNT(cc.course_id)::INTEGER AS course_count
      FROM categories c
      LEFT JOIN course_categories cc ON cc.category_id = c.id
      LEFT JOIN courses co ON co.id = cc.course_id AND co.is_published = true
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC;
    `;
    const res = await pool.query(sql);
    return res.rows;
  }
}

export default CourseModel;

