import crypto from 'crypto';
import { pool, getClient } from '../config/db.js';

export class CertificateModel {
  /**
   * Issue a new verified course completion certificate
   *
   * @param {string} userId
   * @param {string} courseId
   */
  static async issueCertificate(userId, courseId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Check if certificate already issued
      const existing = await client.query(
        `SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2;`,
        [userId, courseId]
      );
      if (existing.rows.length > 0) {
        await client.query('COMMIT');
        return existing.rows[0];
      }

      // 2. Fetch course & user details for certificate metadata
      const detailsRes = await client.query(
        `SELECT c.title, c.estimated_hours, u.email, p.first_name, p.last_name,
                i.first_name AS instructor_first, i.last_name AS instructor_last
         FROM courses c
         JOIN users u ON u.id = $1
         JOIN user_profiles p ON p.user_id = u.id
         JOIN users iu ON iu.id = c.instructor_id
         JOIN user_profiles i ON i.user_id = iu.id
         WHERE c.id = $2;`,
        [userId, courseId]
      );
      const details = detailsRes.rows[0];

      // 3. Generate unique verifiable code: CCH-YEAR-XXXX-XXXX
      const year = new Date().getFullYear();
      const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
      const randomHex2 = crypto.randomBytes(4).toString('hex').toUpperCase();
      const certificateCode = `CCH-${year}-${randomHex}-${randomHex2}`;
      const verificationUrl = `/verify-certificate/${certificateCode}`;

      const metadata = {
        studentName: `${details.first_name} ${details.last_name}`,
        courseTitle: details.title,
        instructorName: `${details.instructor_first} ${details.instructor_last}`,
        estimatedHours: details.estimated_hours,
        issuer: 'CodeCraftHub Learning Platform',
      };

      const certSql = `
        INSERT INTO certificates (user_id, course_id, certificate_code, verification_url, metadata_json)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const certRes = await client.query(certSql, [
        userId,
        courseId,
        certificateCode,
        verificationUrl,
        JSON.stringify(metadata),
      ]);
      const certificate = certRes.rows[0];

      // 4. Create congratulatory achievement notification
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, action_url)
         VALUES ($1, $2, $3, 'achievement', $4);`,
        [
          userId,
          `Certificate Earned: ${details.title}`,
          `Congratulations! You have completed all lessons and earned an official certificate (${certificateCode}).`,
          `/certificates`,
        ]
      );

      await client.query('COMMIT');
      return certificate;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Find all certificates earned by a user
   *
   * @param {string} userId
   */
  static async findUserCertificates(userId) {
    const sql = `
      SELECT 
        cert.id,
        cert.certificate_code,
        cert.issued_at,
        cert.verification_url,
        cert.metadata_json,
        c.id AS course_id,
        c.title AS course_title,
        c.thumbnail_url,
        json_build_object(
          'firstName', p.first_name,
          'lastName', p.last_name,
          'avatarUrl', p.avatar_url
        ) AS instructor
      FROM certificates cert
      JOIN courses c ON c.id = cert.course_id
      JOIN users u ON u.id = c.instructor_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE cert.user_id = $1
      ORDER BY cert.issued_at DESC;
    `;
    const res = await pool.query(sql, [userId]);
    return res.rows;
  }

  /**
   * Public certificate verification by code
   *
   * @param {string} code
   */
  static async findByCode(code) {
    const sql = `
      SELECT 
        cert.certificate_code,
        cert.issued_at,
        cert.metadata_json,
        c.title AS course_title,
        c.thumbnail_url,
        p.first_name AS student_first_name,
        p.last_name AS student_last_name,
        ip.first_name AS instructor_first_name,
        ip.last_name AS instructor_last_name
      FROM certificates cert
      JOIN courses c ON c.id = cert.course_id
      JOIN users u ON u.id = cert.user_id
      JOIN user_profiles p ON p.user_id = u.id
      JOIN users iu ON iu.id = c.instructor_id
      JOIN user_profiles ip ON ip.user_id = iu.id
      WHERE cert.certificate_code = $1;
    `;
    const res = await pool.query(sql, [code.trim()]);
    return res.rows[0] || null;
  }
}

export default CertificateModel;
