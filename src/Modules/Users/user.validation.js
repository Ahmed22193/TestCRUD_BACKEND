import { generalFields } from "../../Middleware/generalFildes.js";
import Joi from "joi";
import { logoutEnum } from "../../Utils/token.utils.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";
export const shareProfileValidation = {
  params: Joi.object({
    userId: generalFields.id.required(),
  }).required(),
};
export const updateProfileValidation = {
  body: Joi.object({
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    phone: generalFields.phone,
    gender: generalFields.gender,
  }).required(),
};
export const freeezeAccountValidation = {
  params: Joi.object({
    userId: generalFields.id,
  }).required(),
};
export const restorAccountValidation = {
  params: Joi.object({
    userId: generalFields.id.required(),
  }).required(),
};
export const hardDeleteAccount = {
  params: Joi.object({
    userId: generalFields.id.required(),
  }).required(),
};
export const updatePasswordValidation = {
  body: Joi.object({
    flag: Joi.string()
      .valid(...Object.values(logoutEnum))
      .default(logoutEnum.stayLoggedIn),
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(Joi.ref("oldPassword")).required(),
  }).required(),
};
export const profileImageValidation = {
  file: Joi.object({
    fieldname: generalFields.file.fieldname.valid("profileImage").required(),
    originalname: generalFields.file.originalname.required(),
    encoding: generalFields.file.encoding.required(),
    mimetype: generalFields.file.mimetype
      .valid(...fileValidation.images)
      .required(),
    destination: generalFields.file.destination.required(),
    filename: generalFields.file.filename.required(),
    size: generalFields.file.size.max(5 * 1024 * 1024).required(),
    path: generalFields.file.path.required(),
    finalPath: generalFields.file.finalPath.required(),
  }).required(),
};
export const coverImageValidation = {
  files: Joi.array().items(
    Joi.object({
      fieldname: generalFields.file.fieldname.valid("coverImages").required(),
      originalname: generalFields.file.originalname.required(),
      encoding: generalFields.file.encoding.required(),
      mimetype: generalFields.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      destination: generalFields.file.destination.required(),
      filename: generalFields.file.filename.required(),
      size: generalFields.file.size.max(5 * 1024 * 1024).required(),
      path: generalFields.file.path.required(),
      finalPath: generalFields.file.finalPath.required(),
    })
  ).required(),
};
