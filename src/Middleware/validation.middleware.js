import { signUpValidation } from "../Modules/Auth/auth.validation.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    for (const Key of Object.keys(schema)) {
      const validationResults = schema[Key].validate(req[Key], {
        abortEarly: false,
      });
      if (validationResults.error) {
        validationError.push({ Key, details: validationResults.error.details });
      }
    }
    if (validationError.length) {
      return res.status(400).json({
        message: "validation error",
        details: validationError,
      });
    }
    return next();
  };
};
