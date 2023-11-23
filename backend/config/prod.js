import helmet from 'helmet';
import compression from 'compression';

// Initialise compression and add security headers
export function initProd(app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.use(compression());
  }
}
