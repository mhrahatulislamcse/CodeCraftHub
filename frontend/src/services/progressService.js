import api from './api.js';

export const progressService = {
  /**
   * Fetch current user's dashboard learning statistics, streak, and weekly activity
   */
  async getProgressSummary() {
    const res = await api.get('/progress/me');
    return res.data;
  },

  /**
   * Get detailed course syllabus completion progress
   * @param {string} courseId 
   */
  async getCourseProgress(courseId) {
    const res = await api.get(`/progress/courses/${courseId}`);
    return res.data;
  },

  /**
   * Toggle completion status of a lesson
   * @param {string} lessonId 
   * @param {boolean} completed 
   * @param {string} notes 
   */
  async toggleLesson(lessonId, completed = true, notes = '') {
    const res = await api.post(`/progress/lessons/${lessonId}/complete`, {
      completed,
      notes,
    });
    return res.data;
  },
};

export default progressService;
