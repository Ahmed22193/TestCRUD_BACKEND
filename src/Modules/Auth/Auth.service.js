import {
  create,
  findOne,
  updateOne,
  findOneAndUpdate,
} from "../../DB/dbService.js";
import TokenModels from "../../DB/models/token.models.js";
import UserModels, { providers } from "../../DB/models/user.models.js";
import { successRespons } from "../../Utils/successRespons.js";
import { compair, hash } from "../../Utils/hash.utils.js";
import { encrept } from "../../Utils/encreption.utils.js";
import { getNewLoginCredentials, logoutEnum } from "../../Utils/token.utils.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../Utils/events/event.utils.js";
import { customAlphabet, nanoid } from "nanoid";

export const SignUp = async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone } = req.body;

  // check email
  if (await findOne({ model: UserModels, filter: { email } }))
    return next(new Error("User already exist"), { cause: 409 });
  // create userr
  const hashPassword = await hash({ plainText: password });
  const encreptPhone = await encrept(phone);

  // create otp
  const code = nanoid(6);
  const hashOTP = await hash({ plainText: code });

  emailEvent.emit("confirmEmail", {
    to: email,
    firstName: firstName,
    otp: code,
    subject: "Confirm your email",
  });

  const user = await create({
    model: UserModels,
    data: [
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        gender: gender,
        phone: encreptPhone,
        confirmEmailOTP: hashOTP,
        provider: providers.system,
      },
    ],
  });
  return successRespons({
    res,
    data: user,
    status: 201,
    message: "User created successfully.",
  });
};
export const Login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findOne({ model: UserModels, filter: { email } });
  if (!user) return next(new Error("wrong! email or password"), { cause: 401 });

  const isMatch = await compair({ plainText: password, hash: user.password });
  if (!isMatch) return next(new Error("Invalid credentials", { cause: 401 }));

  if (!user.confirmEmail) {
    return next(new Error("Email not confirmed", { cause: 403 }));
  }

  const newCredentials = await getNewLoginCredentials(user);

  return successRespons({
    res,
    data: {
      accessToken: newCredentials.accessToken,
      refreshToken: newCredentials.refreshToken,
    },
    status: 200,
    message: "user login successfully.",
  });
};
export const Logout = async (req, res, next) => {
  const { flag } = req.body;
  let status = 200;
  switch (flag) {
    case logoutEnum.logoutFromAllDevices:
      await updateOne({
        model: UserModels,
        filter: {
          _id: req.user._id,
        },
        data: {
          changeCredentialsTime: Date.now(),
        },
      });
      break;
    default:
      await create({
        model: TokenModels,
        data: {
          jti: req.decoded.jti,
          userId: req.user._id,
          expiresIn: Date.now() - req.decoded.exp,
        },
      });
      status = 201;
      break;
  }

  return successRespons({
    res,
    status: status,
    message: "user logged out successfully.",
  });
};

// changeCredentials:Date

async function verifyGoogleAcc({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const { email, email_verified, picture, given_name, family_name } =
    await verifyGoogleAcc({ idToken });
  if (!email_verified)
    return next(new Error("Email Not Verfied", { cause: 401 }));
  const user = await findOne({
    model: UserModels,
    filter: { email },
  });
  if (user) {
    //login
    if (user.provider === providers.google) {
      const newCredentials = await getNewLoginCredentials(user);

      return successRespons({
        res,
        data: {
          accessToken: newCredentials.accessToken,
          refreshToken: newCredentials.refreshToken,
        },
        status: 200,
        message: "user login successfully.",
      });
    }
    // system login
  }
  // create user
  const newUser = await create({
    model: UserModels,
    data: [
      {
        email,
        firstName: given_name,
        lastName: family_name,
        photo: picture,
        provider: providers.google,
        confirmEmail: Date.now(),
      },
    ],
  });

  const newCredentials = await getNewLoginCredentials(User);

  return successRespons({
    res,
    data: {
      accessToken: newCredentials.accessToken,
      refreshToken: newCredentials.refreshToken,
    },
    status: 201,
    message: "user created successfully.",
  });
};
export const refreshToken = async (req, res, next) => {
  const User = req.user;
  const newCredentials = await getNewLoginCredentials(User);

  return successRespons({
    res,
    data: {
      accessToken: newCredentials.accessToken,
      refreshToken: newCredentials.refreshToken,
    },
    status: 200,
    message: "New credentials generated successfully.",
  });
};
export const confirmOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await findOne({
    model: UserModels,
    filter: {
      email: email.toLowerCase().trim(),
      confirmEmail: { $in: [null, undefined] },
      confirmEmailOTP: { $exists: true },
    },
  });

  if (!user) {
    return next(
      new Error("User not found or already confirmed", { cause: 404 })
    );
  }

  const isMatch = await compair({ plainText: otp, hash: user.confirmEmailOTP });
  if (!isMatch) {
    return next(new Error("Invalid OTP", { cause: 400 }));
  }

  await updateOne({
    model: UserModels,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOTP: 1 },
      $inc: { __v: 1 },
    },
  });

  return successRespons({
    res,
    status: 200,
    message: "Email confirmed successfully.",
  });
};
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const otp = await customAlphabet("0123456789", 6)();
  const hashOTP = await hash({ plainText: otp });
  const user = await findOneAndUpdate({
    model: UserModels,
    filter: {
      email,
      provider: providers.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
    },
    data: {
      forgetPasswordOTP: hashOTP,
    },
  });
  if (!user)
    return next(
      new Error("user not found or Email not Confirmed", { cause: 404 })
    );

  emailEvent.emit("forgetPassword", {
    to: email,
    firstName: user.firstName,
    otp,
  });

  return successRespons({
    res,
    status: 200,
    message: "OTP send successfully. check your Inbox",
  });
};
export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await findOne({
    model: UserModels,
    filter: {
      email,
      provider: providers.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
      forgetPasswordOTP: { $exists: true },
    },
  });
  if (!user) return next(new Error("Invalid Account", { cause: 404 }));

  // compare otp hash

  if (!(await compair({ plainText: otp, hash: user.forgetPasswordOTP })))
    return next(new Error("Invalid OTP", { cause: 400 }));
  const hashPassword = await hash({ plainText: password });

  await updateOne({
    model: UserModels,
    filter: {
      email,
    },
    data: {
      password: hashPassword,
      $unset: {
        forgetPasswordOTP: true,
      },
      $inc: { __v: 1 },
    },
  });
  return successRespons({
    res,
    status: 200,
    message: "password reset successfully.",
  });
};
