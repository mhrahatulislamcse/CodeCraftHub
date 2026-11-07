import api from './api.js';

export const certificateService = {
  /**
   * Get all certificates earned by the authenticated user
   */
  async getMyCertificates() {
    const res = await api.get('/certificates/me');
    return res.data || [];
  },

  /**
   * Verify certificate by unique code (e.g. CCH-2026-XXXX-XXXX)
   * @param {string} code 
   */
  async verifyCertificate(code) {
    const res = await api.get(`/certificates/verify/${code}`);
    return res.data;
  },
};

export default certificateService;

