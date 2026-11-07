import { pool, getClient } from '../config/db.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

export class EnrollmentModel {
  /**
   * Enroll a user in a course
   *
   * @param {string} userId
   * @param {string} courseId
   */
  static async enroll(userId, courseId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Check if course exists and is published
      const courseRes = await client.query(
        `SELECT id, title, is_published FROM courses WHERE id = $1;`,
        [courseId]
      );
      if (courseRes.rows.length === 0) {
        throw new NotFoundError('Course not found');
      }

      if (!courseRes.rows[0].is_published) {
        throw new ConflictError('Cannot enroll in an unpublished course');
      }

      // 2. Check if already enrolled
      const existingRes = await client.query(
        `SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2;`,
        [userId, courseId]
      );
      if (existingRes.rows.length > 0) {
        throw new ConflictError('You are already enrolled in this course');
      }

      // 3. Create enrollment record
      const enrollSql = `
        INSERT INTO enrollments (user_id, course_id, progress_percentage, status)
        VALUES ($1, $2, 0.00, 'active')
        RETURNING *;
      `;
      const enrollRes = await client.query(enrollSql, [userId, courseId]);
      const enrollment = enrollRes.rows[0];

      // 4. Increment course enrollment count
      await client.query(
        `UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = $1;`,
        [courseId]
      );

      // 5. Create initial enrollment notification
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, action_url)
         VALUES ($1, $2, $3, 'info', $4);`,
        [
          userId,
          `Enrolled in ${courseRes.rows[0].title}`,
          'Your enrollment is active. Start with your first lesson today!',
          `/learn/${courseId}`,
        ]
      );

      await client.query('COMMIT');
      return enrollment;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Find user enrollments with rich course & instructor metadata
   *
   * @param {string} userId
   * @param {Object} [filters]
   * @param {string} [filters.status]
   */
  static async findUserEnrollments(userId, { status } = {}) {
    const conditions = ['e.user_id = $1'];
    const values = [userId];
    let idx = 2;

    if (status && ['active', 'completed', 'archived', 'paused'].includes(status)) {
      conditions.push(`e.status = $${idx}`);
      values.push(status);
      idx++;
    }

    const sql = `
      SELECT 
        e.id,
        e.course_id,
        e.progress_percentage,
        e.status,
        e.enrolled_at,
        e.completed_at,
        e.last_accessed_at,
        c.title AS course_title,
        c.slug AS course_slug,
        c.thumbnail_url,
        c.difficulty_level,
        c.estimated_hours,
        -- Instructor details
        json_build_object(
          'id', u.id,
          'firstName', p.first_name,
          'lastName', p.last_name,
          'avatarUrl', p.avatar_url
        ) AS instructor,
        -- Total lessons in course
        (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS total_lessons,
        -- Completed lessons for this enrollment
        (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.enrollment_id = e.id AND lp.completed = true) AS completed_lessons,
        -- Next lesson to continue
        (
          SELECT json_build_object('id', nl.id, 'title', nl.title, 'orderIndex', nl.order_index)
          FROM lessons nl
          LEFT JOIN lesson_progress nlp ON nlp.enrollment_id = e.id AND nlp.lesson_id = nl.id AND nlp.completed = true
          WHERE nl.course_id = c.id AND nlp.id IS NULL
          ORDER BY nl.order_index ASC
          LIMIT 1
        ) AS next_lesson
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      JOIN users u ON u.id = c.instructor_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY e.last_accessed_at DESC;
    `;

    const res = await pool.query(sql, values);
    return res.rows;
  }

  /**
   * Find single enrollment by ID
   *
   * @param {string} enrollmentId
   * @param {string} userId
   */
  static async findById(enrollmentId, userId) {
    const sql = `
      SELECT 
        e.id,
        e.course_id,
        e.user_id,
        e.progress_percentage,
        e.status,
        e.enrolled_at,
        e.completed_at,
        e.last_accessed_at,
        c.title AS course_title,
        c.slug AS course_slug,
        c.thumbnail_url,
        c.difficulty_level,
        c.estimated_hours,
        json_build_object(
          'id', u.id,
          'firstName', p.first_name,
          'lastName', p.last_name,
          'avatarUrl', p.avatar_url
        ) AS instructor
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      JOIN users u ON u.id = c.instructor_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE e.id = $1 AND e.user_id = $2;
    `;

    const res = await pool.query(sql, [enrollmentId, userId]);
    return res.rows[0] || null;
  }

  /**
   * Find enrollment by user ID and course ID
   *
   * @param {string} userId
   * @param {string} courseId
   */
  static async findByUserAndCourse(userId, courseId) {
    const sql = `
      SELECT id, user_id, course_id, progress_percentage, status, enrolled_at, completed_at, last_accessed_at
      FROM enrollments
      WHERE user_id = $1 AND course_id = $2;
    `;
    const res = await pool.query(sql, [userId, courseId]);
    return res.rows[0] || null;
  }
}

export default EnrollmentModel;

