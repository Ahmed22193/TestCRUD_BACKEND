import Joi from "joi";
import { generalFields } from "../../Middleware/generalFildes.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";
export const sendMessageValidation = {
  params: Joi.object({
    receiverId: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    content: Joi.string().min(2).max(20000),
  }),
  files: Joi.array()
    .items(
      Joi.object({
        fieldname: generalFields.file.fieldname.valid("attachments").required(),
        originalname: generalFields.file.originalname.required(),
        encoding: generalFields.file.encoding.required(),
        mimetype: generalFields.file.mimetype
          .valid(...fileValidation.images)
          .required(),
        destination: generalFields.file.destination.required(),
        filename: generalFields.file.filename.required(),
        size: generalFields.file.size.max(5 * 1024 * 1024).required(),
        path: generalFields.file.path.required(),
        finalPath: generalFields.file.finalPath,
      })
    )
    .min(0)
    .max(3),
};
export const getdMessageValidation = {
  params: Joi.object({
    userId: generalFields.id.required(),
  }).required(),
};
