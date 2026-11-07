import api from './api.js';

export const enrollmentService = {
  /**
   * Get authenticated user's enrollments (status: active, completed, all)
   * @param {Object} params - { status, page, limit }
   */
  async getMyEnrollments(params = {}) {
    const res = await api.get('/enrollments/me', { params });
    return res.data;
  },

  /**
   * Get single enrollment details by ID
   * @param {string} enrollmentId 
   */
  async getEnrollmentById(enrollmentId) {
    const res = await api.get(`/enrollments/${enrollmentId}`);
    return res.data?.enrollment;
  },
};

export default enrollmentService;

