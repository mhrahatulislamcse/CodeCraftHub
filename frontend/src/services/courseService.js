import api from './api.js';

export const courseService = {
  /**
   * List courses with filtering, search, sorting, and pagination
   * @param {Object} params - { search, category, difficulty, sortBy, sortOrder, page, limit }
   */
  async getCourses(params = {}) {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  /**
   * Get single course details by UUID or slug
   * @param {string} idOrSlug 
   */
  async getCourseById(idOrSlug) {
    const res = await api.get(`/courses/${idOrSlug}`);
    return res.data?.course;
  },

  /**
   * Fetch all course categories
   */
  async getCategories() {
    const res = await api.get('/courses/categories');
    return res.data?.categories || [];
  },

  /**
   * Enroll the authenticated user into a course
   * @param {string} courseId 
   */
  async enrollCourse(courseId) {
    const res = await api.post(`/courses/${courseId}/enroll`);
    return res.data;
  },

  /**
   * Get syllabus lessons for a course
   * @param {string} courseId 
   */
  async getCourseLessons(courseId) {
    const res = await api.get(`/courses/${courseId}/lessons`);
    return res.data?.lessons || [];
  },
};

export default courseService;
