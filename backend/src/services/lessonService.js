import { LessonModel } from '../models/lessonModel.js';
import { CourseModel } from '../models/courseModel.js';
import { pool } from '../config/db.js';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export class LessonService {
  /**
   * Helper to slugify lesson title
   * @param {string} title
   */
  static slugify(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get all lessons for a course curriculum
   *
   * @param {string} courseIdOrSlug
   * @param {Object} [user]
   */
  static async getCourseLessons(courseIdOrSlug, user = null) {
    const course = await CourseModel.findByIdOrSlug(courseIdOrSlug);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const lessons = await LessonModel.findByCourseId(course.id);

    // Determine access privileges
    const isInstructor = user && user.id === course.instructor.id;
    const isAdmin = user && user.role === 'admin';

    let isEnrolled = false;
    if (user && user.id) {
      const enrollRes = await pool.query(
        `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2;`,
        [user.id, course.id]
      );
      isEnrolled = enrollRes.rows.length > 0;
    }

    const hasFullAccess = isInstructor || isAdmin || isEnrolled;

    return lessons.map((lesson) => {
      if (hasFullAccess || lesson.is_free_preview) {
        return lesson;
      }
      // Mask locked content for prospective students
      return {
        id: lesson.id,
        course_id: lesson.course_id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        order_index: lesson.order_index,
        duration_minutes: lesson.duration_minutes,
        is_free_preview: lesson.is_free_preview,
        isLocked: true,
      };
    });
  }

  /**
   * Get full details of a specific lesson (with authorization check)
   *
   * @param {string} lessonId
   * @param {Object} [user]
   */
  static async getLessonById(lessonId, user = null) {
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Free preview lessons are open to everyone
    if (lesson.is_free_preview) {
      return lesson;
    }

    // Non-preview lessons require authentication
    if (!user) {
      throw new UnauthorizedError('Authentication and enrollment required to view this lesson');
    }

    const isInstructor = user.id === lesson.instructor_id;
    const isAdmin = user.role === 'admin';

    if (isInstructor || isAdmin) {
      return lesson;
    }

    // Verify enrollment
    const enrollRes = await pool.query(
      `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2;`,
      [user.id, lesson.course_id]
    );

    if (enrollRes.rows.length === 0) {
      throw new ForbiddenError('You must enroll in this course to access this lesson');
    }

    return lesson;
  }

  /**
   * Create a new lesson under a course
   *
   * @param {string} courseIdOrSlug
   * @param {Object} lessonData
   * @param {Object} user
   */
  static async createLesson(courseIdOrSlug, lessonData, user) {
    const course = await CourseModel.findByIdOrSlug(courseIdOrSlug);
    if (!course) {
      throw new NotFoundError('Parent course not found');
    }

    const isOwner = course.instructor.id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to add lessons to this course');
    }

    const slug = lessonData.slug ? this.slugify(lessonData.slug) : this.slugify(lessonData.title);

    return LessonModel.create({
      ...lessonData,
      courseId: course.id,
      slug,
    });
  }

  /**
   * Update an existing lesson
   *
   * @param {string} lessonId
   * @param {Object} lessonData
   * @param {Object} user
   */
  static async updateLesson(lessonId, lessonData, user) {
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const isOwner = lesson.instructor_id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to modify this lesson');
    }

    if (lessonData.title && !lessonData.slug) {
      lessonData.slug = this.slugify(lessonData.title);
    }

    return LessonModel.update(lessonId, lessonData);
  }

  /**
   * Delete an existing lesson
   *
   * @param {string} lessonId
   * @param {Object} user
   */
  static async deleteLesson(lessonId, user) {
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const isOwner = lesson.instructor_id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to delete this lesson');
    }

    return LessonModel.delete(lessonId);
  }
}

export default LessonService;
