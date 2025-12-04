import { roles } from "../../DB/models/user.models.js";

export const endPoint = {
  getProfile: [roles.admin, roles.user],
  updateProfile: [roles.admin, roles.user],
  freezeAccount: [roles.admin, roles.user],
  restorAccount: [roles.admin],
  restorMyAccount: [roles.user],
  hardDeleteAccount: [roles.admin],
  updatePassword:[roles.admin, roles.user]
};
