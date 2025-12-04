import { Router } from "express";
import * as Auth from "./Auth.service.js";
import { Authentication } from "../../Middleware/Authentication.middleware.js";
import { tokenTypeEnum } from "../../Middleware/Authentication.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  loginValidation,
  signUpValidation,
  SocialLoginValidation,
  confirmEmailValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
  logoutValidation,
} from "./auth.validation.js";
import { rateLimit } from "express-rate-limit";
const router = Router();

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 60 * 1000, // 2 hours
  limit: 4,
  message: {
    statusCode: 429,
    message: "Too many requests from this IP, please try again later.",
  },
  legacyHeaders: false,
});

router.post("/signUp", validation(signUpValidation), Auth.SignUp);
router.post("/login", loginLimiter, validation(loginValidation), Auth.Login);

router.post(
  "/logout",
  validation(logoutValidation),
  Authentication({ tokenType: tokenTypeEnum.access }),
  Auth.Logout
);

router.post(
  "/social-login",
  validation(SocialLoginValidation),
  Auth.loginWithGmail
);
router.patch(
  "/confirmOTP",
  validation(confirmEmailValidation),
  Auth.confirmOTP
);
router.get(
  "/refresh-token",
  Authentication({ tokenType: tokenTypeEnum.refresh }),
  Auth.refreshToken
);
router.patch(
  "/forget-password",
  validation(forgetPasswordValidation),
  Auth.forgetPassword
);
router.patch(
  "/resetPassword",
  validation(resetPasswordValidation),
  Auth.resetPassword
);

export default router;
