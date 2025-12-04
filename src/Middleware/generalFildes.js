import Joi from "joi";
import { Types } from "mongoose";

export const generalFields = {
  firstName: Joi.string().min(3).max(20).messages({
    "string.min": "first name must be at least 3 char long",
    "string.max": "first name must be at most 20 char long",
    "any.required": "first name is required",
  }),
  lastName: Joi.string().min(3).max(20).messages({
    "string.min": "last name must be at least 3 char long",
    "string.max": "last name must be at most 20 char long",
    "any.required": "last name is required",
  }),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 5,
    tlds: { allow: ["com", "net", "edu", "io", "gov", "org"] },
  }),
  password: Joi.string().pattern(/^[A-Za-z\d@#$!?&]{8,20}$/),
  gender: Joi.string().valid("MALE", "FEMALE").default("MALE"),
  phone: Joi.string().pattern(/(^002|\+2)?01[0125]\d{8}/),
  id: Joi.string().custom((value, helper) => {
    return (
      Types.ObjectId.isValid(value) || helper.message("Invalid ObjectId format")
    );
  }),
  otp: Joi.string().length(6),
  file: {
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string(),
    destination: Joi.string(),
    filename: Joi.string(),
    size: Joi.number().positive().min(0),
    path: Joi.string(),
    buffer: Joi.binary(),
    finalPath: Joi.string(),
  },
};
