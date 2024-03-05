import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('login here');
});
router.get('/dashboard', (req, res) => {
  res.send('dashboard');
});

export default router;
