import { CertificateService } from '../services/certificateService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get current user's earned certificates
 * GET /api/v1/certificates/me
 */
export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await CertificateService.getMyCertificates(req.user.id);
  return sendSuccess(res, {
    data: certificates,
    message: 'User certificates retrieved successfully',
  });
});

/**
 * Public certificate verification endpoint
 * GET /api/v1/certificates/verify/:code
 */
export const verifyCertificate = asyncHandler(async (req, res) => {
  const verification = await CertificateService.verifyCertificate(req.params.code);
  return sendSuccess(res, {
    data: verification,
    message: 'Certificate successfully verified',
  });
});

export default {
  getMyCertificates,
  verifyCertificate,
};

