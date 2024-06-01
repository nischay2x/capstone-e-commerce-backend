import { Router } from "express";
import {  getUsers, suspendUser, updateUser, createUser, updatePassword, updatePicture, unSuspendUser, getUserById } from "../controllers/user.js";
import { validateCreateUser, validatePasswordChange, validateUpdateUser } from "../middleware/user.js";
import { validateAdmin, validateToken } from "../middleware/auth.js";
import multerUpload from "../middleware/multerUpload.js";


const userRouter = Router();

userRouter.post("/", validateCreateUser, createUser)
userRouter.get("/", validateAdmin, getUsers);
userRouter.get("/:id", validateAdmin, getUserById);
userRouter.put("/", validateToken, validateUpdateUser, updateUser);
userRouter.put("/password", validateToken, validatePasswordChange, updatePassword);
userRouter.put("/picture", validateToken, multerUpload.single('image'), updatePicture);
userRouter.delete("/suspend/:id", validateAdmin, suspendUser);
userRouter.delete("/unsuspend/:id", validateAdmin, unSuspendUser);

export default userRouter;


