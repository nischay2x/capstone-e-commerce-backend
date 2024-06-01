import { Router } from "express";
import { cancelOrder, createOrder, getOrderById, getOrders } from "../controllers/order.js";
import { validateCreateOrder } from "../middleware/order.js";
import { validateUser } from "../middleware/auth.js";


const orderRouter = Router();

orderRouter.use(validateUser);
orderRouter.post("/", validateCreateOrder, createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.put("/:id/cancel", cancelOrder);

export default orderRouter;