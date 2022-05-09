import express from "express";
import AuthControllers from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", AuthControllers.register);

export default router;
