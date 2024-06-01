import { Router } from "express";
import { validateAdmin} from "../middleware/auth.js";
import { getAdminOverview } from "../controllers/admin.js";

const userRouter = Router();

userRouter.get("/overview", validateAdmin, getAdminOverview);

export default userRouter;


