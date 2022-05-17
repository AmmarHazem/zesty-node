import express from "express";
import AuthControllers from "../controllers/authControllers.js";

const router = express.Router();

router.post("/refresh-token", AuthControllers.refreshToken);
router.post("/register", AuthControllers.register);
router.post("/verify-email", AuthControllers.verifyEmail);
router.post("/login", AuthControllers.login);

export default router;
