import { Router } from "express";
import { getNewToken, login, sendEmailOtp, verifyOtpAndChangePassword } from "../controllers/auth.js";
import { validateLogin } from "../middleware/auth.js";

const authRouter = Router();

authRouter.get("/token", getNewToken);
authRouter.post("/login", validateLogin, login);
authRouter.post("/otp", sendEmailOtp);
authRouter.post("/verify", verifyOtpAndChangePassword);

export default authRouter;

