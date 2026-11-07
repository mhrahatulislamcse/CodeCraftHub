import { AiService } from '../services/aiService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Generate personalized recommendations and skill gap analysis
 * POST /api/v1/ai/recommendations/generate
 */
export const generateRecommendations = asyncHandler(async (req, res) => {
  const targetRole = req.body.targetRole || 'Full-Stack React & Node Engineer';
  const result = await AiService.generateRecommendations(req.user.id, targetRole);

  return sendSuccess(res, {
    data: result,
    message: 'Personalized recommendations generated successfully',
  });
});

/**
 * Get active saved recommendations for current user
 * GET /api/v1/ai/recommendations/me
 */
export const getMyRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await AiService.getMyRecommendations(req.user.id);

  return sendSuccess(res, {
    data: { recommendations },
    message: 'User recommendations retrieved successfully',
  });
});

/**
 * Analyze skill gap for a target career role
 * POST /api/v1/ai/skill-gap
 */
export const analyzeSkillGap = asyncHandler(async (req, res) => {
  const targetRole = req.body.targetRole || 'Full-Stack React & Node Engineer';
  const gap = await AiService.analyzeSkillGap(req.user.id, targetRole);

  return sendSuccess(res, {
    data: gap,
    message: 'Skill gap analysis completed successfully',
  });
});

/**
 * Technical concept explanation & assistant
 * POST /api/v1/ai/explain
 */
export const explainConcept = asyncHandler(async (req, res) => {
  const { topic, context } = req.body;
  const result = await AiService.explainConcept(topic, context);

  return sendSuccess(res, {
    data: result,
    message: 'Concept explanation retrieved successfully',
  });
});

/**
 * Dismiss a recommendation
 * DELETE /api/v1/ai/recommendations/:id
 */
export const dismissRecommendation = asyncHandler(async (req, res) => {
  const dismissed = await AiService.dismissRecommendation(req.params.id, req.user.id);

  return sendSuccess(res, {
    data: dismissed,
    message: 'Recommendation dismissed',
  });
});

export default {
  generateRecommendations,
  getMyRecommendations,
  analyzeSkillGap,
  explainConcept,
  dismissRecommendation,
};

