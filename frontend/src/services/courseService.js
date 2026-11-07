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

  /**
   * Get single lesson details and workspace content by lesson ID
   * @param {string} lessonId 
   */
  async getLessonById(lessonId) {
    const res = await api.get(`/lessons/${lessonId}`);
    return res.data;
  },

  /**
   * Instructor Studio: Get courses created by current instructor
   * @param {Object} params 
   */
  async getMyInstructorCourses(params = {}) {
    const res = await api.get('/courses/instructor/my-courses', { params });
    return res;
  },

  /**
   * Instructor Studio: Get aggregate metrics
   */
  async getInstructorAnalytics() {
    const res = await api.get('/courses/instructor/analytics');
    return res.data;
  },

  /**
   * Instructor Studio: Create new course
   * @param {Object} courseData 
   */
  async createCourse(courseData) {
    const res = await api.post('/courses', courseData);
    return res.data;
  },

  /**
   * Instructor Studio: Update course
   * @param {string} courseId 
   * @param {Object} updateData 
   */
  async updateCourse(courseId, updateData) {
    const res = await api.patch(`/courses/${courseId}`, updateData);
    return res.data;
  },

  /**
   * Instructor Studio: Delete course
   * @param {string} courseId 
   */
  async deleteCourse(courseId) {
    const res = await api.delete(`/courses/${courseId}`);
    return res.data;
  },

  /**
   * Curriculum Builder: Add lesson to course
   * @param {string} courseId 
   * @param {Object} lessonData 
   */
  async createLesson(courseId, lessonData) {
    const res = await api.post(`/courses/${courseId}/lessons`, lessonData);
    return res.data;
  },

  /**
   * Curriculum Builder: Delete lesson
   * @param {string} lessonId 
   */
  async deleteLesson(lessonId) {
    const res = await api.delete(`/lessons/${lessonId}`);
    return res.data;
  },
};

export default courseService;

