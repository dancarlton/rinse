import { initProd } from './prod.js';
import { initDB } from './db.js';
import { initCORS } from './cors.js';
import { initPassportJS } from './passport.js';
import { initRateLimit } from './rateLimit.js';

export async function initConfig(app) {
  initPassportJS();
  initCORS(app);
  await initDB();
  initProd(app);
  initRateLimit(app);
}
