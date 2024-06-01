import { Router } from "express";
import { addCartItem, deleteCartItem, updateCartItem } from "../controllers/cartItem.js";
import { validateAddCartItem, validateUpdateCartItem } from "../middleware/cartItem.js";
import { validateUser } from "../middleware/auth.js";

const cartItemRouter = Router();

cartItemRouter.use(validateUser);
cartItemRouter.post("/", validateAddCartItem, addCartItem);
cartItemRouter.put("/:id", validateUpdateCartItem, updateCartItem);
cartItemRouter.delete("/:id", deleteCartItem);

export default cartItemRouter;