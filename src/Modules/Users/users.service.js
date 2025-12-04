import { decrypt, encrept } from "../../Utils/encreption.utils.js";
import { successRespons } from "../../Utils/successRespons.js";
import * as dbservices from "../../DB/dbService.js";
import UserModels, { roles } from "../../DB/models/user.models.js";
import { compair, hash } from "../../Utils/hash.utils.js";
import { logoutEnum } from "../../Utils/token.utils.js";
import TokenModel from "../../DB/models/token.models.js";
export const getUser = async (req, res, next) => {
  const user = await dbservices.findById({
    model: UserModels,
    id: req.user._id,
    populate: [{ path: "Messages" }],
  });
  user.phone = await decrypt(user.phone);
  
  return successRespons({
    res,
    status: 200,
    message: "User fetched successfully.",
    data: user,
  });
};
export const shareProfile = async (req, res, next) => {
  const { userId } = req.params;
  const user = await dbservices.findOne({
    model: UserModels,
    filter: {
      _id: userId,
      confirmEmail: { $exists: true },
    },
  });

  return user
    ? successRespons({
        res,
        status: 200,
        message: "User Fetched successfully.",
        data: { user },
      })
    : next(new Error("Invalid Or Not Verified Account", { cause: 404 }));
};
export const updateProfile = async (req, res, next) => {
  // phone
  if (req.body.phone) {
    req.body.phone = await encrept(req.body.phone);
  }

  const updatedUser = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: { _id: req.user._id },
    data: req.body,
  });
  return updatedUser
    ? successRespons({
        res,
        status: 200,
        message: "user Updated successfully.",
        data: { updatedUser },
      })
    : next(new Error("Invalid Account", { cause: 404 }));
};
export const freezeAccount = async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role != roles.admin) {
    return next(
      new Error("You are not Authorized to freeze this account", { cause: 401 })
    );
  }
  const updatedUser = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: { _id: userId || req.user._id, deletedAt: { $exists: false } },
    data: {
      deletedAt: Date.now(),
      deletedBy: req.user._id,
      $unset: {
        restoredAt: true,
        restoredBy: true,
      },
    },
  });
  return updatedUser
    ? successRespons({
        res,
        status: 200,
        message: "User Frozen successfully.",
        data: updatedUser,
      })
    : next(new Error("Invalid Account", { cause: 404 }));
};
export const restorAccount = async (req, res, next) => {
  const { userId } = req.params;

  const updateUser = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
      deletedBy: { $ne: userId },
    },
    data: {
      $unset: {
        deletedAt: true,
        deletedBy: true,
      },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
  });
  return updateUser
    ? successRespons({
        res,
        status: 200,
        message: "User restored successfully.",
        data: updateUser,
      })
    : next(new Error("Invalid Account", { cause: 404 }));
};
export const restorMyAccount = async (req, res, next) => {
  const userId = req.user._id;

  const updateUser = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
      deletedBy: userId,
    },
    data: {
      $unset: {
        deletedAt: true,
        deletedBy: true,
      },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
  });
  return updateUser
    ? successRespons({
        res,
        status: 200,
        message: "User restored successfully.",
        data: updateUser,
      })
    : next(new Error("Invalid Account", { cause: 404 }));
};
export const hardDeleteAccount = async (req, res, next) => {
  const { userId } = req.params;
  const deleteUser = await dbservices.deleteOne({
    model: UserModels,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
    },
  });
  return deleteUser.deletedCount
    ? successRespons({
        res,
        status: 200,
        message: "User deleted successfully.",
      })
    : next(new Error("Invalid Account", { cause: 404 }));
};
export const updatePassword = async (req, res, next) => {
  const userId = req.user._id;
  const { oldPassword, password, flag } = req.body;
  if (!(await compair({ plainText: oldPassword, hash: req.user.password }))) {
    return next(new Error("Old Password is incorrect", { cause: 400 }));
  }

  let updateData = {};
  switch (flag) {
    case logoutEnum.logoutFromAllDevices:
      updateData.changeCredentialsTime = Date.now();
      break;
    case logoutEnum.logout:
      await dbservices.create({
        model: TokenModel,
        data: {
          jti: req.decoded.jti,
          userId: req.user._id,
          expiresIn: Date.now() - req.decoded.iat,
        },
      });
      break;
    default:
      break;
  }

  const updateUser = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: {
      _id: userId,
    },
    data: {
      password: await hash({ plainText: password }),
      ...updateData,
    },
  });
  return updateUser
    ? successRespons({
        res,
        status: 200,
        message: "password updated successfully.",
        data: updateUser,
      })
    : next(new Error("Invalid data", { cause: 404 }));
};
import {
  uploadSingleImage,
  deleteImageProfile,
  uploadMultiImage,
  deleteCoverImages,
} from "../../Utils/multer/cloud.multer.js";
// import { cloudinaryConfig } from "../../Utils/multer/cloudinary.js";

export const updateProfileImage = async (req, res, next) => {
  const { public_id, secure_url } = await uploadSingleImage({
    req,
    folderName: "Users",
  });
  const user = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: { _id: req.user._id },
    data: { profileImageCloud: { public_id, secure_url } },
  });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  await deleteImageProfile(req);

  return successRespons({
    res,
    status: 200,
    message: "Profile image updated successfully.",
    data: { cloud: { public_id, secure_url } },
  });
};
export const updateCoverImages = async (req, res, next) => {
  const attatchments = await uploadMultiImage({
    req,
    folderName: "Users",
  });

  const user = await dbservices.findOneAndUpdate({
    model: UserModels,
    filter: { _id: req.user._id },
    data: { coverImagesCloud: attatchments },
  });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  await deleteCoverImages(req);

  return successRespons({
    res,
    status: 200,
    message: "Cover images updated successfully.",
    data: { user },
  });
};
