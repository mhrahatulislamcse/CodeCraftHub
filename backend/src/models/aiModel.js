import { pool } from '../config/db.js';

export class AiModel {
  /**
   * Save a generated AI recommendation to the database
   *
   * @param {Object} data - { userId, recommendationType, recommendedEntityId, reason, confidenceScore, metadataJson }
   */
  static async saveRecommendation({
    userId,
    recommendationType,
    recommendedEntityId = null,
    reason,
    confidenceScore = 0.85,
    metadataJson = {},
  }) {
    const sql = `
      INSERT INTO ai_recommendations (
        user_id,
        recommendation_type,
        recommended_entity_id,
        reason,
        confidence_score,
        metadata_json
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await pool.query(sql, [
      userId,
      recommendationType,
      recommendedEntityId,
      reason,
      confidenceScore,
      JSON.stringify(metadataJson),
    ]);
    return res.rows[0];
  }

  /**
   * Get all active (not dismissed) recommendations for a user
   *
   * @param {string} userId
   * @param {number} [limit=10]
   */
  static async getUserRecommendations(userId, limit = 10) {
    const sql = `
      SELECT 
        r.id,
        r.user_id,
        r.recommendation_type,
        r.recommended_entity_id,
        r.reason,
        r.confidence_score,
        r.metadata_json,
        r.is_dismissed,
        r.created_at,
        -- If entity is a course, attach course title and thumbnail
        c.title AS course_title,
        c.thumbnail_url AS course_thumbnail,
        c.difficulty_level AS course_difficulty
      FROM ai_recommendations r
      LEFT JOIN courses c ON c.id = r.recommended_entity_id AND r.recommendation_type = 'course'
      WHERE r.user_id = $1 AND r.is_dismissed = false
      ORDER BY r.created_at DESC
      LIMIT $2;
    `;
    const res = await pool.query(sql, [userId, limit]);
    return res.rows;
  }

  /**
   * Dismiss a recommendation
   *
   * @param {string} recommendationId
   * @param {string} userId
   */
  static async dismissRecommendation(recommendationId, userId) {
    const sql = `
      UPDATE ai_recommendations
      SET is_dismissed = true
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const res = await pool.query(sql, [recommendationId, userId]);
    return res.rows[0] || null;
  }

  /**
   * Fetch current skills verified or logged for a user
   *
   * @param {string} userId
   */
  static async getUserSkills(userId) {
    const sql = `
      SELECT 
        s.id,
        s.name,
        s.slug,
        s.category,
        s.description,
        us.proficiency_level,
        us.verified_at
      FROM user_skills us
      JOIN skills s ON s.id = us.skill_id
      WHERE us.user_id = $1;
    `;
    const res = await pool.query(sql, [userId]);
    return res.rows;
  }

  /**
   * Fetch all skills available across the platform catalog
   */
  static async getAllSkills() {
    const sql = `
      SELECT id, name, slug, category, description
      FROM skills
      ORDER BY category ASC, name ASC;
    `;
    const res = await pool.query(sql);
    return res.rows;
  }

  /**
   * Fetch courses associated with their gained skills
   */
  static async getCoursesWithSkills() {
    const sql = `
      SELECT 
        c.id,
        c.title,
        c.slug,
        c.description,
        c.difficulty_level,
        c.estimated_hours,
        c.thumbnail_url,
        c.rating_average,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', s.id,
                'name', s.name,
                'slug', s.slug,
                'level', cs.skill_level_gained
              )
            )
            FROM course_skills cs
            JOIN skills s ON s.id = cs.skill_id
            WHERE cs.course_id = c.id
          ),
          '[]'::json
        ) AS skills
      FROM courses c
      WHERE c.is_published = true;
    `;
    const res = await pool.query(sql);
    return res.rows;
  }

  /**
   * Find matching learning path for target role
   *
   * @param {string} targetRole
   */
  static async findLearningPathForRole(targetRole) {
    const sql = `
      SELECT 
        lp.id,
        lp.title,
        lp.slug,
        lp.description,
        lp.target_role,
        lp.difficulty_level,
        lp.estimated_weeks,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', c.id,
                'title', c.title,
                'difficulty', c.difficulty_level,
                'estimatedHours', c.estimated_hours,
                'sequenceOrder', lpc.sequence_order
              )
              ORDER BY lpc.sequence_order ASC
            )
            FROM learning_path_courses lpc
            JOIN courses c ON c.id = lpc.course_id
            WHERE lpc.learning_path_id = lp.id
          ),
          '[]'::json
        ) AS courses
      FROM learning_paths lp
      WHERE lp.is_published = true AND (
        LOWER(lp.target_role) LIKE LOWER($1) OR
        LOWER(lp.title) LIKE LOWER($1)
      )
      LIMIT 1;
    `;
    const res = await pool.query(sql, [`%${targetRole}%`]);
    return res.rows[0] || null;
  }
}

export default AiModel;
