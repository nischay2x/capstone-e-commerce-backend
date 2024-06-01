import { Router } from "express";
import { completeOrder, dispatchOrder, getDashboardOverview, getSellerOrderById, getSellerOrders } from "../controllers/seller-orders.js";
import { validateSeller } from "../middleware/auth.js";


const sellerOrderRouter = Router();

sellerOrderRouter.use(validateSeller);
sellerOrderRouter.get("/", getSellerOrders);
sellerOrderRouter.get("/overview", getDashboardOverview);
sellerOrderRouter.get("/:id", getSellerOrderById);
sellerOrderRouter.put("/dispatch/:id", dispatchOrder);
sellerOrderRouter.put("/complete/:id", completeOrder);

export default sellerOrderRouter;