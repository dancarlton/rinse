import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import baseRoutes from './baseRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import reviewRoutes from './reviewRoutes.js';

export function initRoutes(app) {
  app.use('/api', baseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('api/bookings', bookingRoutes);
  app.use('api/services', serviceRoutes);
  app.use('api/reviews', reviewRoutes);
  app.use('/healthcheck', (req, res) => res.send('Router routing OK'));
}
