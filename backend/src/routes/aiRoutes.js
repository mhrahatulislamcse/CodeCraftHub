import { Router } from 'express';
import {
  generateRecommendations,
  getMyRecommendations,
  analyzeSkillGap,
  explainConcept,
  dismissRecommendation,
} from '../controllers/aiController.js';
import {
  skillGapValidator,
  explainConceptValidator,
  recommendationIdValidator,
} from '../validators/aiValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Skill gap analysis
router.post('/skill-gap', authenticate, validate(skillGapValidator), analyzeSkillGap);

// Recommendations generation & retrieval
router.post('/recommendations/generate', authenticate, validate(skillGapValidator), generateRecommendations);
router.get('/recommendations/me', authenticate, getMyRecommendations);
router.delete('/recommendations/:id', authenticate, validate(recommendationIdValidator), dismissRecommendation);

// Technical concept explanation (accessible authenticated)
router.post('/explain', authenticate, validate(explainConceptValidator), explainConcept);

export default router;

