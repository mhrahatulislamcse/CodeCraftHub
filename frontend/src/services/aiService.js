import api from './api.js';

export const aiService = {
  /**
   * Perform skill gap analysis for a target technical career role
   * @param {string} targetRole 
   */
  async analyzeSkillGap(targetRole = 'Full-Stack React & Node Engineer') {
    const res = await api.post('/ai/skill-gap', { targetRole });
    return res.data;
  },

  /**
   * Generate personalized recommendations grounded in course data
   * @param {string} targetRole 
   */
  async generateRecommendations(targetRole = 'Full-Stack React & Node Engineer') {
    const res = await api.post('/ai/recommendations/generate', { targetRole });
    return res.data;
  },

  /**
   * Get active recommendations for the authenticated user
   */
  async getMyRecommendations() {
    const res = await api.get('/ai/recommendations/me');
    return res.data?.recommendations || [];
  },

  /**
   * Ask the CodeCraft AI concept explainer assistant
   * @param {string} topic 
   * @param {string} context 
   */
  async explainConcept(topic, context = '') {
    const res = await api.post('/ai/explain', { topic, context });
    return res.data;
  },

  /**
   * Dismiss a recommendation
   * @param {string} recommendationId 
   */
  async dismissRecommendation(recommendationId) {
    const res = await api.delete(`/ai/recommendations/${recommendationId}`);
    return res.data;
  },
};

export default aiService;
