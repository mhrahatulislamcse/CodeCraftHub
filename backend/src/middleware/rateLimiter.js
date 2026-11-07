import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Standard API Rate Limiter
 * Guards the general API from abuse or brute force requests.
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // Default 15 minutes
  max: config.rateLimit.max, // Default 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: () => config.env === 'test', // Bypass in test suite
  handler: (req, res) => {
    return sendError(res, {
      message: 'Too many requests from this IP address. Please try again after 15 minutes.',
      statusCode: 429,
      errorCode: 'RATE_LIMIT_EXCEEDED',
      req,
    });
  },
});

/**
 * Strict Rate Limiter for Authentication Endpoints
 * Prevents credential stuffing and brute-force attacks on login/registration/reset.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 attempts per 15-minute window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'test',
  handler: (req, res) => {
    return sendError(res, {
      message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
      statusCode: 429,
      errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
      req,
    });
  },
});

export default {
  apiLimiter,
  authLimiter,
};

