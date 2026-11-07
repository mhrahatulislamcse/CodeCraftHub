import { pool, getClient } from '../config/db.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export class ProgressModel {
  /**
   * Toggle completion state of a lesson
   *
   * @param {string} userId
   * @param {string} lessonId
   * @param {boolean} [completed=true]
   * @param {string} [notes=null]
   */
  static async toggleLessonProgress(userId, lessonId, completed = true, notes = null) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Identify parent course
      const lessonRes = await client.query(
        `SELECT id, course_id, title FROM lessons WHERE id = $1;`,
        [lessonId]
      );
      if (lessonRes.rows.length === 0) {
        throw new NotFoundError('Lesson not found');
      }
      const lesson = lessonRes.rows[0];

      // 2. Identify user enrollment
      const enrollRes = await client.query(
        `SELECT id, status, progress_percentage FROM enrollments WHERE user_id = $1 AND course_id = $2;`,
        [userId, lesson.course_id]
      );
      if (enrollRes.rows.length === 0) {
        throw new ForbiddenError('You must be enrolled in this course to track progress');
      }
      const enrollment = enrollRes.rows[0];

      // 3. Upsert lesson_progress record
      const completedAt = completed ? new Date() : null;
      const progressSql = `
        INSERT INTO lesson_progress (enrollment_id, lesson_id, completed, completed_at, last_accessed_at, notes)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
        ON CONFLICT (enrollment_id, lesson_id) 
        DO UPDATE SET 
          completed = EXCLUDED.completed,
          completed_at = EXCLUDED.completed_at,
          last_accessed_at = CURRENT_TIMESTAMP,
          notes = COALESCE(EXCLUDED.notes, lesson_progress.notes)
        RETURNING *;
      `;

      const progressRes = await client.query(progressSql, [
        enrollment.id,
        lesson.id,
        completed,
        completedAt,
        notes,
      ]);

      // 4. Retrieve automatically synchronized enrollment record (updated by database trigger)
      const updatedEnrollRes = await client.query(
        `SELECT id, course_id, progress_percentage, status, completed_at, last_accessed_at 
         FROM enrollments WHERE id = $1;`,
        [enrollment.id]
      );

      await client.query('COMMIT');

      return {
        lessonProgress: progressRes.rows[0],
        enrollment: updatedEnrollRes.rows[0],
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Get detailed progress breakdown for a course
   *
   * @param {string} userId
   * @param {string} courseId
   */
  static async getCourseProgress(userId, courseId) {
    // 1. Check enrollment
    const enrollRes = await pool.query(
      `SELECT id, progress_percentage, status, enrolled_at, completed_at, last_accessed_at
       FROM enrollments WHERE user_id = $1 AND course_id = $2;`,
      [userId, courseId]
    );

    if (enrollRes.rows.length === 0) {
      throw new ForbiddenError('You are not enrolled in this course');
    }
    const enrollment = enrollRes.rows[0];

    // 2. Fetch all course lessons with user progress
    const lessonsSql = `
      SELECT 
        l.id,
        l.course_id,
        l.title,
        l.slug,
        l.order_index,
        l.duration_minutes,
        l.is_free_preview,
        COALESCE(lp.completed, false) AS completed,
        lp.completed_at,
        lp.last_accessed_at,
        lp.notes
      FROM lessons l
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.enrollment_id = $1
      WHERE l.course_id = $2
      ORDER BY l.order_index ASC;
    `;
    const lessonsRes = await pool.query(lessonsSql, [enrollment.id, courseId]);
    const lessons = lessonsRes.rows;

    // 3. Find next recommended lesson (first incomplete lesson)
    const nextLesson = lessons.find((l) => !l.completed) || null;

    return {
      enrollment: {
        id: enrollment.id,
        progressPercentage: parseFloat(enrollment.progress_percentage),
        status: enrollment.status,
        enrolledAt: enrollment.enrolled_at,
        completedAt: enrollment.completed_at,
        lastAccessedAt: enrollment.last_accessed_at,
      },
      lessons,
      nextLesson,
    };
  }

  /**
   * Get Student Dashboard overall analytics & learning telemetry
   *
   * @param {string} userId
   */
  static async getUserOverallProgress(userId) {
    // 1. Enrollment counts & completion rates
    const enrollStatsSql = `
      SELECT 
        COUNT(*)::INTEGER AS total_enrolled,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER AS total_completed,
        COUNT(CASE WHEN status = 'active' THEN 1 END)::INTEGER AS total_active,
        ROUND(COALESCE(AVG(progress_percentage), 0), 1) AS average_progress
      FROM enrollments
      WHERE user_id = $1;
    `;
    const statsRes = await pool.query(enrollStatsSql, [userId]);
    const stats = statsRes.rows[0];

    // 2. Total learning hours completed
    const hoursSql = `
      SELECT ROUND(COALESCE(SUM(l.duration_minutes), 0)::NUMERIC / 60.0, 1) AS total_hours
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      JOIN enrollments e ON e.id = lp.enrollment_id
      WHERE e.user_id = $1 AND lp.completed = true;
    `;
    const hoursRes = await pool.query(hoursSql, [userId]);
    const totalHours = parseFloat(hoursRes.rows[0].total_hours);

    // 3. Calculate Learning Streak (consecutive active days backwards from today)
    const streakSql = `
      WITH active_days AS (
        SELECT DISTINCT DATE_TRUNC('day', lp.last_accessed_at)::DATE AS activity_date
        FROM lesson_progress lp
        JOIN enrollments e ON e.id = lp.enrollment_id
        WHERE e.user_id = $1 AND lp.last_accessed_at IS NOT NULL
      ),
      numbered AS (
        SELECT activity_date,
               activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::INTEGER AS grp
        FROM active_days
      )
      SELECT COUNT(*)::INTEGER AS streak
      FROM numbered
      WHERE grp = (
        SELECT grp FROM numbered 
        WHERE activity_date >= CURRENT_DATE - INTERVAL '1 day' 
        ORDER BY activity_date DESC LIMIT 1
      );
    `;
    const streakRes = await pool.query(streakSql, [userId]);
    const streak = streakRes.rows[0]?.streak || 0;

    // 4. Weekly Learning Activity (Last 7 days daily lesson completion counts)
    const weeklySql = `
      SELECT 
        TO_CHAR(d.day, 'Dy') AS day_name,
        d.day::DATE AS date,
        COUNT(lp.id)::INTEGER AS lessons_completed
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::INTERVAL) d(day)
      LEFT JOIN (
        SELECT lp.id, lp.completed_at
        FROM lesson_progress lp
        JOIN enrollments e ON e.id = lp.enrollment_id
        WHERE e.user_id = $1 AND lp.completed = true
      ) lp ON DATE_TRUNC('day', lp.completed_at)::DATE = d.day::DATE
      GROUP BY d.day
      ORDER BY d.day ASC;
    `;
    const weeklyRes = await pool.query(weeklySql, [userId]);

    // 5. Continue Learning (Most recently accessed active course)
    const continueSql = `
      SELECT 
        e.id AS enrollment_id,
        e.course_id,
        e.progress_percentage,
        e.last_accessed_at,
        c.title AS course_title,
        c.thumbnail_url,
        (
          SELECT json_build_object('id', l.id, 'title', l.title, 'orderIndex', l.order_index)
          FROM lessons l
          LEFT JOIN lesson_progress lp ON lp.enrollment_id = e.id AND lp.lesson_id = l.id AND lp.completed = true
          WHERE l.course_id = c.id AND lp.id IS NULL
          ORDER BY l.order_index ASC LIMIT 1
        ) AS continue_lesson
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.user_id = $1 AND e.status = 'active'
      ORDER BY e.last_accessed_at DESC
      LIMIT 1;
    `;
    const continueRes = await pool.query(continueSql, [userId]);

    return {
      totalEnrolledCourses: stats.total_enrolled,
      totalCompletedCourses: stats.total_completed,
      totalActiveCourses: stats.total_active,
      averageProgress: parseFloat(stats.average_progress),
      learningHours: totalHours,
      currentStreakDays: streak,
      weeklyActivity: weeklyRes.rows,
      continueLearning: continueRes.rows[0] || null,
    };
  }
}

export default ProgressModel;
