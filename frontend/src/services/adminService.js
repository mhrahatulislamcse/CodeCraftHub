import api from './api.js';

export const adminService = {
  /**
   * Get platform-wide analytics and live database latency
   */
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  /**
   * Get paginated users with optional search and role filtering
   * @param {Object} params - { page, limit, search, role }
   */
  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res;
  },

  /**
   * Change a user's authorization role
   * @param {string} userId 
   * @param {string} role 
   */
  async updateRole(userId, role) {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  /**
   * Toggle user active/suspended status
   * @param {string} userId 
   * @param {boolean} isActive 
   */
  async updateStatus(userId, isActive) {
    const res = await api.patch(`/admin/users/${userId}/status`, { isActive });
    return res.data;
  },

  /**
   * Toggle course publication state
   * @param {string} courseId 
   * @param {boolean} isPublished 
   */
  async toggleCoursePublish(courseId, isPublished) {
    const res = await api.patch(`/admin/courses/${courseId}/publish`, { isPublished });
    return res.data;
  },
};

export default adminService;
