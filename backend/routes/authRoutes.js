/* eslint-disable import/no-named-as-default-member */
import express from "express";
import passport from "passport";
import AuthControllers from "../controllers/authController.js";

const router = express.Router();

/**
 * @desc Google OAuth 2.0 via passport
 * @route /google
 * @method GET
 */
router.get(
  "/google",
  // scope tells us how much to ask from google
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @desc Google OAuth 2.0 via passport callback. used to redirect after successful authentication
 * @route /google/callback
 * @method GET
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // Successful authentication, redirect to client for now
    res.redirect("http://localhost:5173/");
  }
);

router.get("/login/failed", AuthControllers.loginFail);

router.get("/login/success", AuthControllers.loginSuccess);

router.get("/logout", AuthControllers.logoutUser);
//  Input : username/password via body
//  HTTP Success : 200, message and user infos.
//  HTTP Errors : 400, 401.
router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/login/success",
    failureRedirect: "/login/failed",
  })
);
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
