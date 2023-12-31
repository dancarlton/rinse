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

//  Input : email via body.
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500, 503.
// router.post("/login/forgot", AuthControllers.postLoginForgot);

//  Input : reset token via params, new password via body.
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500, 503.
// router.post("/login/reset/:token", AuthControllers.postLoginReset);

//  Input : void, identified by session cookie.
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 500, 503.
// router.post("/logout", AuthControllers.postLogout);

//  Input : email via body;
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500, 503.
// router.post("/send-confirmation", AuthControllers.postVerify);

// router.get("/confirmation/:token", AuthControllers.getConfirmation);

export default router;
