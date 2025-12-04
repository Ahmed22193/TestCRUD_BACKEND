import { findById, findOne } from "../DB/dbService.js";
import TokenModels from "../DB/models/token.models.js";
import UserModels from "../DB/models/user.models.js";
import { verifyToken } from "../Utils/token.utils.js";
import { getSignature } from "../Utils/token.utils.js";

export const tokenTypeEnum = {
  access: "access",
  refresh: "refresh",
};

const decodedToken = async ({
  authorization,
  tokenType = tokenTypeEnum.access,
  next,
}) => {
  if (!authorization)
    return next(new Error("No authorization header", { cause: 401 }));
  const [bearer, token] = authorization.split(" ") || [];
  if (!bearer || !token)
    return next(new Error("Invalid Token", { cause: 401 }));

  let signature = await getSignature(bearer);

  const decode = verifyToken(
    token,
    (signature =
      tokenType === tokenTypeEnum.access
        ? signature.accessSignature
        : signature.refreshSignature)
  );

  if (
    decode.jti &&
    (await findOne({
      model: TokenModels,
      filter: {
        jti: decode.jti,
      },
    }))
  )
    return next(new Error("Token is Revoked", { cause: 401 }));

  const user = await findById({ model: UserModels, id: decode._id });
  if (!user) return next(new Error("user not found", { cause: 404 }));

  //changeCredentials > iat
  if (user.changeCredentialsTime?.getTime() > decode.iat * 1000) {
    return next(new Error("Token is Expierd", { cause: 401 }));
  }
  return { user, decode };
};
export const Authentication = ({ tokenType = tokenTypeEnum.access }) => {
  return async (req, res, next) => {
    const { user, decode } =
      (await decodedToken({
        authorization: req.headers.authorization,
        tokenType,
        next,
      })) || {};
    req.user = user;
    req.decoded = decode;
    // req.file = file;
    return next();
  };
};
export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("unauthorized", { cause: 403 }));
    }
    return next();
  };
};
