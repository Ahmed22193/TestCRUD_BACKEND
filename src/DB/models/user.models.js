import mongoose, { Schema } from "mongoose";

export const genderValues = {
  male: "MALE",
  female: "FEMALE",
};
export const providers = {
  system: "SYSTEM",
  google: "GOOGLE",
};
export const roles = {
  user: "USER",
  admin: "ADMIN",
};

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "first name must be at least 3 characters long"],
      maxLength: [20, "first name must be at most 20 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "last name must be at least 3 characters long"],
      maxLength: [20, "last name must be at most 20 characters long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providers.system ? true : false;
      },
    },
    gender: {
      type: String,
      enum: Object.values(genderValues),
      default: genderValues.male,
    },
    profileImage: String,
    coverImages: [String],

    profileImageCloud: { public_id: String, secure_url: String },
    coverImagesCloud: [{ public_id: String, secure_url: String }],

    confirmEmail: Date,
    confirmEmailOTP: String,
    photo: String,
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    restoredAt: Date,
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    forgetPasswordOTP: String,
    changeCredentialsTime: Date,
    provider: {
      type: String,
      enum: {
        values: Object.values(providers),
        message: `Provider must be either ${Object.values(providers).join(
          " or "
        )}`,
      },
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roles),
        message: `roles must be ${Object.values(roles).join(" or ")}`,
      },
      default: roles.user,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("Messages", {
  localField: "_id",
  foreignField: "receiverId",
  ref: "Message",
});

const UserModels = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModels;
