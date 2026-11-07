import { CertificateModel } from '../models/certificateModel.js';
import { NotFoundError } from '../utils/errors.js';

export class CertificateService {
  /**
   * List all certificates earned by the authenticated user
   *
   * @param {string} userId
   */
  static async getMyCertificates(userId) {
    return CertificateModel.findUserCertificates(userId);
  }

  /**
   * Public certificate verification by unique code
   *
   * @param {string} code
   */
  static async verifyCertificate(code) {
    const cert = await CertificateModel.findByCode(code);
    if (!cert) {
      throw new NotFoundError(`Certificate with verification code '${code}' not found or invalid.`);
    }

    return {
      isValid: true,
      certificateCode: cert.certificate_code,
      issuedAt: cert.issued_at,
      courseTitle: cert.course_title,
      studentName: `${cert.student_first_name} ${cert.student_last_name}`,
      instructorName: `${cert.instructor_first_name} ${cert.instructor_last_name}`,
      metadata: cert.metadata_json,
    };
  }
}

export default CertificateService;

