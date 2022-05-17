import crypto from "crypto";
import TokenModel from "../models/Token.js";
import { createAccessJWT, createRefreshJWT } from "./jwt.js";

const loginUser = async ({ user, response }) => {
  let refreshToken;
  const existingToken = await TokenModel.findOne({ user: user._id });
  console.log("--- valid token", existingToken?.isValid);
  if (existingToken && existingToken.isValid) {
    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(40).toString("hex");
    await TokenModel.create({ refreshToken, user: user._id });
  }
  if (existingToken && !existingToken.isValid) {
    await existingToken.remove();
  }
  const responseUser = {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
  };
  const accessJWT = createAccessJWT({ user: responseUser });
  const refreshJWT = createRefreshJWT({ user: responseUser, refreshToken });
  response.json({
    user: responseUser,
    accessToken: accessJWT,
    refreshToken: refreshJWT,
  });
};

export default loginUser;
