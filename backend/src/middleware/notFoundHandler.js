/**
 * 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: {
      message: `Endpoint not found: [${req.method}] ${req.originalUrl}`,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  });
};

export default notFoundHandler;

