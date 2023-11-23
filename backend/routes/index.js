import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import baseRoutes from './baseRoutes.js';

export function initRoutes(app) {
  app.use('/api', baseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/healthcheck', (req, res) => res.send('Router routing OK'));
}
