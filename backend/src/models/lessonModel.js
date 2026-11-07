import { pool, getClient } from '../config/db.js';

export class LessonModel {
  /**
   * Find all lessons for a course in curriculum sequence
   *
   * @param {string} courseId
   */
  static async findByCourseId(courseId) {
    const sql = `
      SELECT 
        l.id,
        l.course_id,
        l.title,
        l.slug,
        l.description,
        l.order_index,
        l.duration_minutes,
        l.is_free_preview,
        l.resources,
        l.created_at,
        l.updated_at
      FROM lessons l
      WHERE l.course_id = $1
      ORDER BY l.order_index ASC;
    `;
    const res = await pool.query(sql, [courseId]);
    return res.rows;
  }

  /**
   * Find single lesson by ID with course context
   *
   * @param {string} id
   */
  static async findById(id) {
    const sql = `
      SELECT 
        l.id,
        l.course_id,
        l.title,
        l.slug,
        l.description,
        l.video_url,
        l.content_markdown,
        l.order_index,
        l.duration_minutes,
        l.is_free_preview,
        l.resources,
        l.created_at,
        l.updated_at,
        c.title AS course_title,
        c.slug AS course_slug,
        c.instructor_id,
        c.is_published
      FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id = $1;
    `;
    const res = await pool.query(sql, [id]);
    return res.rows[0] || null;
  }

  /**
   * Create a new lesson
   *
   * @param {Object} data
   */
  static async create(data) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Determine next order_index if omitted
      let orderIndex = data.orderIndex;
      if (orderIndex === undefined || orderIndex === null) {
        const orderRes = await client.query(
          `SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM lessons WHERE course_id = $1;`,
          [data.courseId]
        );
        orderIndex = orderRes.rows[0].next_order;
      }

      const sql = `
        INSERT INTO lessons (
          course_id,
          title,
          slug,
          description,
          video_url,
          content_markdown,
          order_index,
          duration_minutes,
          is_free_preview,
          resources
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;

      const res = await client.query(sql, [
        data.courseId,
        data.title,
        data.slug,
        data.description || '',
        data.videoUrl || '',
        data.contentMarkdown || '',
        orderIndex,
        data.durationMinutes || 0,
        Boolean(data.isFreePreview),
        JSON.stringify(data.resources || []),
      ]);

      const newLesson = res.rows[0];

      // Auto update estimated_hours on parent course
      await client.query(
        `UPDATE courses 
         SET estimated_hours = (
           SELECT ROUND(COALESCE(SUM(duration_minutes), 0)::NUMERIC / 60.0, 1)
           FROM lessons WHERE course_id = $1
         ) WHERE id = $1;`,
        [data.courseId]
      );

      await client.query('COMMIT');
      return newLesson;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Update lesson details
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
        videoUrl: 'video_url',
        contentMarkdown: 'content_markdown',
        orderIndex: 'order_index',
        durationMinutes: 'duration_minutes',
        isFreePreview: 'is_free_preview',
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

      if (data.resources !== undefined) {
        sets.push(`resources = $${idx}`);
        values.push(JSON.stringify(data.resources));
        idx++;
      }

      if (sets.length === 0) {
        await client.query('COMMIT');
        return this.findById(id);
      }

      values.push(id);
      const updateSql = `
        UPDATE lessons 
        SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${idx}
        RETURNING course_id;
      `;

      const updateRes = await client.query(updateSql, values);
      const courseId = updateRes.rows[0]?.course_id;

      if (courseId) {
        // Recalculate parent course hours
        await client.query(
          `UPDATE courses 
           SET estimated_hours = (
             SELECT ROUND(COALESCE(SUM(duration_minutes), 0)::NUMERIC / 60.0, 1)
             FROM lessons WHERE course_id = $1
           ) WHERE id = $1;`,
          [courseId]
        );
      }

      await client.query('COMMIT');
      return this.findById(id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Delete lesson
   *
   * @param {string} id
   */
  static async delete(id) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const res = await client.query(`DELETE FROM lessons WHERE id = $1 RETURNING id, course_id;`, [id]);
      const deleted = res.rows[0];

      if (deleted) {
        // Recalculate course hours
        await client.query(
          `UPDATE courses 
           SET estimated_hours = (
             SELECT ROUND(COALESCE(SUM(duration_minutes), 0)::NUMERIC / 60.0, 1)
             FROM lessons WHERE course_id = $1
           ) WHERE id = $1;`,
          [deleted.course_id]
        );
      }

      await client.query('COMMIT');
      return deleted;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export default LessonModel;

