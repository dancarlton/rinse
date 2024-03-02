import { initProd } from './prod.js';
import { initDB } from './db.js';
import { initCORS } from './cors.js';
import { initPassportJS } from './passport.js';
import { initRateLimit } from './rateLimit.js';
// import { initLogger } from "./logging.js";

export async function initConfig(app) {
  initPassportJS();
  // initLogger();
  initCORS(app);
  initDB();
  initProd(app);
  initRateLimit(app);
}
