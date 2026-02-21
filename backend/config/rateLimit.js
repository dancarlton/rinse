import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.VERCEL === '1' ? 0 : 20, // disable in serverless, 20 req/min locally
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export function initRateLimit(app) {
  app.use(limiter);
}
