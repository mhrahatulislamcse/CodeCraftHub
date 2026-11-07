import { Router } from 'express';
import {
  getMyCertificates,
  verifyCertificate,
} from '../controllers/certificateController.js';
import { certificateCodeParamValidator } from '../validators/enrollmentValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Authenticated user's earned certificates
router.get('/me', authenticate, getMyCertificates);

// Public certificate verification
router.get('/verify/:code', validate(certificateCodeParamValidator), verifyCertificate);

export default router;
