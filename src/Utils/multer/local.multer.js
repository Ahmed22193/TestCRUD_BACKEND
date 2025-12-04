import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export const fileValidation = {
  images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  pdfs: ["application/pdf"],
  docs: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  videos: [
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/x-msvideo",
    "video/x-matroska",
    "video/quicktime",
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/mp3"],
};
export const localFileUpload = ({
  customPath = "general",
  validation = [],
}) => {
  const basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userPath = basePath;
      if (req.user?._id) userPath += `/${req.user._id}`;
      const fullPath = path.resolve(`./src/${userPath}`);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() +
        "__" +
        crypto.randomBytes(8).toString("hex") +
        "__" +
        file.originalname;
      file.finalPath = `${basePath}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({
    fileFilter,
    storage,
  });
};

// import multer from "multer";
// import path from "path";
// import fs from "node:fs";
// export const localFileUpload = ({ customPath = "general" }) => {
//   let basePath = `uploads/${customPath}`;
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       if (req.user?._id) basePath += `/${req.user._id}`;
//       const fullPath = path.resolve(`./src/${basePath}`);
//       if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
//       cb(null, path.resolve(fullPath));
//     },
//     filename: (req, file, cb) => {
//       const uniqueFileName =
//         Date.now() + "__" + Math.random() + "__" + file.originalname;
//       cb(null, uniqueFileName);
//     },
//   });
//   return multer({
//     storage,
//   });
// };
