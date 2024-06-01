import { Router } from "express";
import { getCart } from "../controllers/cart.js";
import { validateUser } from "../middleware/auth.js"

const cartRouter = Router();

cartRouter.get("/", validateUser, getCart);

export default cartRouter;