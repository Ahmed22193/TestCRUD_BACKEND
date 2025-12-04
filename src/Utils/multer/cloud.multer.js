import multer from "multer";
import { cloudinaryConfig } from "./cloudinary.js";
export const cloudFileUpload = ({ validation = [] }) => {
  const storage = multer.diskStorage({});
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

export const uploadSingleImage = async ({ req, folderName }) => {
  const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    { folder: `Sara7a-App/${folderName}/${req.user._id}` }
  );
  return { public_id, secure_url };
};

export const deleteImageProfile = async (req) => {
  if (!req.user.profileImageCloud?.public_id) return;
  await cloudinaryConfig().uploader.destroy(
    req.user.profileImageCloud.public_id
  );
};

export const uploadMultiImage = async ({ req, folderName, receiverId }) => {
  if (!req.files?.length) return [];
  const attatchments = [];
  for (const file of req.files) {
    const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
      file.path,
      {
        folder: `Sara7a-App/${folderName}/${
          receiverId ? receiverId : req.user._id
        }`,
      }
    );
    attatchments.push({ public_id, secure_url });
  }
  return attatchments;
};

export const deleteCoverImages = async (req) => {
  if (!req.user.coverImagesCloud?.length) return;

  for (const img of req.user.coverImagesCloud) {
    await cloudinaryConfig().uploader.destroy(img.public_id);
  }
};
