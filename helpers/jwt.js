import jwt from "jsonwebtoken";

const createJWT = ({ payload, expiresIn = "1h" }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const createAccessJWT = ({ user }) => {
  return createJWT({ payload: user });
};

export const createRefreshJWT = ({ user, refreshToken }) => {
  return createJWT({ payload: { user, refreshToken }, expiresIn: "1d" });
};

export const isValidJWT = ({ token }) =>
  jwt.verify(token, process.env.JWT_SECRET);
