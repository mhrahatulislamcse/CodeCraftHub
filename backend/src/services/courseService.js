import { CourseModel } from '../models/courseModel.js';
import { pool } from '../config/db.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';

export class CourseService {
  /**
   * Helper to generate URL-safe slug from title
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
   * List courses with filtering, search, and pagination
   *
   * @param {Object} query - Query parameters from request
   * @param {Object} [user] - Authenticated user if available
   */
  static async listCourses(query = {}, user = null) {
    const isInstructorSelf = query.myCourses === 'true' && user?.id;

    // Filter by publish status
    let isPublished = true;
    if (user?.role === 'admin' || isInstructorSelf) {
      if (query.isPublished !== undefined) {
        isPublished = query.isPublished === 'true';
      } else {
        isPublished = undefined; // Return both drafts and published
      }
    }

    const instructorId = isInstructorSelf ? user.id : query.instructorId;

    return CourseModel.findAll({
      search: query.search,
      categorySlug: query.category,
      categoryId: query.categoryId,
      difficulty: query.difficulty,
      instructorId,
      isPublished,
      sortBy: query.sortBy || 'created_at',
      sortOrder: query.sortOrder || 'DESC',
      page: query.page || 1,
      limit: query.limit || 12,
    });
  }

  /**
   * Get complete course details with enrollment status
   *
   * @param {string} idOrSlug - Course UUID or unique slug
   * @param {Object} [user] - Authenticated user if available
   */
  static async getCourseDetails(idOrSlug, user = null) {
    const course = await CourseModel.findByIdOrSlug(idOrSlug);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Access control for draft / unpublished courses
    if (!course.is_published) {
      const isOwner = user && user.id === course.instructor.id;
      const isAdmin = user && user.role === 'admin';
      if (!isOwner && !isAdmin) {
        throw new NotFoundError('Course not found');
      }
    }

    // Check user enrollment state
    let enrollment = null;
    if (user && user.id) {
      const enrollRes = await pool.query(
        `SELECT id, progress_percentage, status, enrolled_at, completed_at, last_accessed_at
         FROM enrollments 
         WHERE user_id = $1 AND course_id = $2;`,
        [user.id, course.id]
      );
      enrollment = enrollRes.rows[0] || null;
    }

    return {
      ...course,
      isEnrolled: Boolean(enrollment),
      enrollment: enrollment
        ? {
            id: enrollment.id,
            progressPercentage: parseFloat(enrollment.progress_percentage),
            status: enrollment.status,
            enrolledAt: enrollment.enrolled_at,
            completedAt: enrollment.completed_at,
            lastAccessedAt: enrollment.last_accessed_at,
          }
        : null,
    };
  }

  /**
   * Create a new course (Instructor or Admin)
   *
   * @param {Object} courseData
   * @param {Object} user - Authenticated instructor or admin
   */
  static async createCourse(courseData, user) {
    if (!['instructor', 'admin'].includes(user.role)) {
      throw new ForbiddenError('Only instructors or administrators can create courses');
    }

    // Determine slug
    let slug = courseData.slug ? this.slugify(courseData.slug) : this.slugify(courseData.title);

    // Check slug collision
    const existing = await CourseModel.findByIdOrSlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCourse = await CourseModel.create({
      ...courseData,
      slug,
      instructorId: user.id,
    });

    return newCourse;
  }

  /**
   * Update course details
   *
   * @param {string} idOrSlug - Course ID or slug
   * @param {Object} updateData
   * @param {Object} user - Authenticated user
   */
  static async updateCourse(idOrSlug, updateData, user) {
    const course = await CourseModel.findByIdOrSlug(idOrSlug);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Verify ownership
    const isOwner = course.instructor.id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to modify this course');
    }

    if (updateData.title && !updateData.slug) {
      updateData.slug = this.slugify(updateData.title);
    }

    return CourseModel.update(course.id, updateData);
  }

  /**
   * Delete course
   *
   * @param {string} idOrSlug - Course ID or slug
   * @param {Object} user - Authenticated user
   */
  static async deleteCourse(idOrSlug, user) {
    const course = await CourseModel.findByIdOrSlug(idOrSlug);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const isOwner = course.instructor.id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to delete this course');
    }

    return CourseModel.delete(course.id);
  }

  /**
   * List all categories
   */
  static async listCategories() {
    return CourseModel.getCategories();
  }
}

export default CourseService;

