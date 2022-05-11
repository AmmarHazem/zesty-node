import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/User.js";
import CustomErrors from "../errors/index.js";

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
    role,
    password,
    emailVerificationToken,
    locationLat: lat,
    locationLng: lng,
  });
  response.status(StatusCodes.CREATED).json({
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      emailVerificationToken: user.emailVerificationToken,
    },
  });
};

export default { register };
