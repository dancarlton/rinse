import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/google', authController.googleLogin);

router.get('/google/callback', authController.googleCallback);

router.post('/logout', authController.logoutUser);

//  Input : username/password via body
//  HTTP Success : 200, message and user infos.
//  HTTP Errors : 400, 401.
router.post('/login/local', authController.localLogin);

export default router;
