import { generalFields } from "../../Middleware/generalFildes.js";
import Joi from "joi";
import { logoutEnum } from "../../Utils/token.utils.js";

export const signUpValidation = {
  body: Joi.object({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    gender: generalFields.gender,
    phone: generalFields.phone,
  }).required(),
};

export const loginValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }).required(),
};

export const SocialLoginValidation = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }).required(),
};
export const confirmEmailValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }).required(),
};
export const forgetPasswordValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
  }).required(),
};
export const resetPasswordValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
  }).required(),
};
export const logoutValidation = {
  body: Joi.object({
    flag: Joi.string()
      .valid(...Object.values(logoutEnum))
      .default(logoutEnum.stayLoggedIn),
  }).required(),
};
