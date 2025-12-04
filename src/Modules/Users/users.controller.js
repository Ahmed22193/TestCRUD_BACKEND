import { Router } from "express";
import * as USER from "./users.service.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  freeezeAccountValidation,
  shareProfileValidation,
  updateProfileValidation,
  restorAccountValidation,
  hardDeleteAccount,
  updatePasswordValidation,
  profileImageValidation,
  coverImageValidation,
} from "../Users/user.validation.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import {
  Authentication,
  authorization,
  tokenTypeEnum,
} from "../../Middleware/Authentication.middleware.js";
import { endPoint } from "../Users/user.authorization.js";
import { localFileUpload } from "../../Utils/multer/local.multer.js";
import { cloudFileUpload } from "../../Utils/multer/cloud.multer.js";
const router = Router({
  caseSensitive: true,
});

router.get(
  "/getUser",
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.getProfile }),
  USER.getUser
);
router.patch(
  "/update-profile",
  validation(updateProfileValidation),
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.updateProfile }),
  USER.updateProfile
);
router.get(
  "/share-profile/:userId",
  validation(shareProfileValidation),
  USER.shareProfile
);
router.delete(
  "{/:userId}/freeze-account",
  validation(freeezeAccountValidation),
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.freezeAccount }),
  USER.freezeAccount
);
router.patch(
  "/:userId/restor-account",
  validation(restorAccountValidation),
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.restorAccount }),
  USER.restorAccount
);
router.patch(
  "/restor-my-account",
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.restorMyAccount }),
  USER.restorMyAccount
);
router.delete(
  "/:userId/hard-delete",
  validation(hardDeleteAccount),
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.hardDeleteAccount }),
  USER.hardDeleteAccount
);
router.patch(
  "/update-password",
  validation(updatePasswordValidation),
  Authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRoles: endPoint.updatePassword }),
  USER.updatePassword
);
router.patch(
  "/profile-image",
  Authentication({ tokenType: tokenTypeEnum.access }),
  cloudFileUpload({
    validation: [...fileValidation.images],
  }).single("profileImage"),
  USER.updateProfileImage
);
router.patch(
  "/cover-images",
  Authentication({ tokenType: tokenTypeEnum.access }),
  cloudFileUpload({
    validation: [...fileValidation.images],
  }).array("coverImages", 5),
  USER.updateCoverImages
);

export default router;
