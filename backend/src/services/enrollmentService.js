import { EnrollmentModel } from '../models/enrollmentModel.js';
import { CourseModel } from '../models/courseModel.js';
import { NotFoundError } from '../utils/errors.js';

export class EnrollmentService {
  /**
   * Enroll the authenticated user into a course
   *
   * @param {string} userId
   * @param {string} courseIdOrSlug
   */
  static async enrollInCourse(userId, courseIdOrSlug) {
    const course = await CourseModel.findByIdOrSlug(courseIdOrSlug);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const enrollment = await EnrollmentModel.enroll(userId, course.id);
    return {
      enrollment,
      courseTitle: course.title,
    };
  }

  /**
   * Retrieve active and completed enrollments for the authenticated user
   *
   * @param {string} userId
   * @param {Object} [filters]
   */
  static async getMyEnrollments(userId, filters = {}) {
    return EnrollmentModel.findUserEnrollments(userId, filters);
  }

  /**
   * Retrieve a specific enrollment record by ID
   *
   * @param {string} enrollmentId
   * @param {string} userId
   */
  static async getEnrollmentDetails(enrollmentId, userId) {
    const enrollment = await EnrollmentModel.findById(enrollmentId, userId);
    if (!enrollment) {
      throw new NotFoundError('Enrollment record not found');
    }
    return enrollment;
  }
}

export default EnrollmentService;
