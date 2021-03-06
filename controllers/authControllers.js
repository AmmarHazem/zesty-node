import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/User.js";
import CustomErrors from "../errors/index.js";
import sendVerificationEmail from "../helpers/sendEmailVerification.js";
import loginUser from "../helpers/loginUser.js";
import TokenModel from "../models/Token.js";
import { createAccessJWT } from "../helpers/jwt.js";
import jwt from "jsonwebtoken";

const refreshToken = async (request, response) => {
  const refreshJWT = request.body.refreshJWT;
  if (!refreshJWT) {
    throw new CustomErrors.BadRequestError("refresh token is requierd");
  }
  const jwtPayload = jwt.verify(refreshJWT, process.env.JWT_SECRET);
  const refreshToken = await TokenModel.findOne({
    refreshToken: jwtPayload.refreshToken,
  }).populate("user", "_id name email phone role emailVerified");
  if (!refreshToken || !refreshToken.isValid) {
    throw new CustomErrors.BadRequestError("invalid or expired refresh token");
  }
  const responseUser = {
    _id: refreshToken.user._id,
    email: refreshToken.user.email,
    phone: refreshToken.user.phone,
    role: refreshToken.user.role,
    emailVerified: refreshToken.user.emailVerified,
  };
  const accessJWT = createAccessJWT({ user: responseUser });
  response.json({
    user: responseUser,
    accessToken: accessJWT,
    refreshToken: refreshJWT,
  });
};

const login = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    throw new CustomErrors.BadRequestError("email and password are required");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new CustomErrors.NotFoundError("invalid credentials");
  }
  if (!user.emailVerified) {
    throw new CustomErrors.BadRequestError("please verify your email first");
  }
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new CustomErrors.NotFoundError("invalid credentials");
  }
  loginUser({ user, response });
};

const verifyEmail = async (request, response) => {
  const { email, token } = request.body;
  if (!email || !token) {
    throw new CustomErrors.BadRequestError(
      "email and verification token are required"
    );
  }
  const user = await UserModel.findOne({
    email: email,
    emailVerificationToken: token,
  });
  if (!user) {
    throw new CustomErrors.NotFoundError("Invalid email or token");
  }
  if (!user.emailVerificationDate) {
    user.emailVerificationDate = new Date();
    user.emailVerified = true;
    await user.save();
  }
  loginUser({ user, response });
};

const register = async (request, response) => {
  const { email, name, phone, password, confirmPassword, lat, lng } =
    request.body;
  let role = request.body.role;
  if (!email) {
    throw new CustomErrors.BadRequestError("email is required");
  }
  if (!name) {
    throw new CustomErrors.BadRequestError("name is required");
  }
  if (!phone) {
    throw new CustomErrors.BadRequestError("phone is required");
  }
  if (!password) {
    throw new CustomErrors.BadRequestError("password is required");
  }
  if (password.length < 6) {
    throw new CustomErrors.BadRequestError("password min length is 6");
  }
  if (confirmPassword !== password) {
    throw new CustomErrors.BadRequestError(
      "password confirmation did not match with the password"
    );
  }
  const isAdmin = request.user && request.user.role === "admin";
  if ((role === "admin" || role === "chef") && !isAdmin) {
    throw new CustomErrors.UnauthorizedError("unauthorized");
  }
  const usersCount = await UserModel.count({});
  if (usersCount === 0) {
    role = "admin";
  }
  const emailVerificationToken = crypto.randomBytes(40).toString("hex");
  const user = await UserModel.create({
    email,
    phone,
    name,
    password,
    emailVerificationToken,
    locationLat: lat,
    locationLng: lng,
    role: role || "customer",
  });
  sendVerificationEmail({
    name,
    email,
  });
  response.status(StatusCodes.CREATED).json({
    message: "We have sent a verification message to your email",
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
};

export default { register, verifyEmail, login, refreshToken };
