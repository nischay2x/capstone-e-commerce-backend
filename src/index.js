import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

import db from './db/index.js';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import cartRouter from './routes/cart.js';
import cartItemRouter from './routes/cartItem.js';
import orderRouter from './routes/order.js';
import productRouter from './routes/product.js';
import sellerOrderRouter from './routes/seller-orders.js';
import adminRouter from "./routes/admin.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON requests
app.use(cors());
app.use((req, res, next) => { console.log(`${req.method.toUpperCase()} ${req.path}`); next(); })
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register API routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/cart-item", cartItemRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/seller-orders", sellerOrderRouter);
app.use("/api/admin", adminRouter);


// Start the server
app.listen(PORT, (err) => {
    if (err) {
        db.$disconnect();
        console.log(err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
