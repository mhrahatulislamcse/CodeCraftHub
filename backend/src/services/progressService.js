import { ProgressModel } from '../models/progressModel.js';
import { CourseModel } from '../models/courseModel.js';
import { CertificateModel } from '../models/certificateModel.js';
import { NotFoundError } from '../utils/errors.js';

export class ProgressService {
  /**
   * Toggle completion of a lesson and handle milestone events
   *
   * @param {string} userId
   * @param {string} lessonId
   * @param {boolean} [completed=true]
   * @param {string} [notes=null]
   */
  static async toggleLessonProgress(userId, lessonId, completed = true, notes = null) {
    const result = await ProgressModel.toggleLessonProgress(userId, lessonId, completed, notes);

    let certificate = null;

    // Automatic Certificate Generation upon 100% course completion
    if (result.enrollment.status === 'completed' && parseFloat(result.enrollment.progress_percentage) >= 100.0) {
      certificate = await CertificateModel.issueCertificate(userId, result.enrollment.course_id);
    }

    return {
      lessonProgress: result.lessonProgress,
      enrollment: {
        id: result.enrollment.id,
        courseId: result.enrollment.course_id,
        progressPercentage: parseFloat(result.enrollment.progress_percentage),
        status: result.enrollment.status,
        completedAt: result.enrollment.completed_at,
      },
      certificateEarned: Boolean(certificate),
      certificate,
    };
  }

  /**
   * Get curriculum progress and next recommended lesson for a course
   *
   * @param {string} userId
   * @param {string} courseIdOrSlug
   */
  static async getCourseProgress(userId, courseIdOrSlug) {
    const course = await CourseModel.findByIdOrSlug(courseIdOrSlug);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const progress = await ProgressModel.getCourseProgress(userId, course.id);
    return {
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
      },
      ...progress,
    };
  }

  /**
   * Get Student Dashboard overall telemetry (streak, learning hours, weekly chart)
   *
   * @param {string} userId
   */
  static async getStudentDashboardStats(userId) {
    return ProgressModel.getUserOverallProgress(userId);
  }
}

export default ProgressService;
