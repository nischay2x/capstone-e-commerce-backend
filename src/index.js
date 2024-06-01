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

// async function updatePrices() {
//     const ps = await db.product.findMany({ select: { id: true, price: true } });
//     for (const p of ps) {
//         const newPrice = Math.floor(p.price * 30);
//         await db.product.update({ where: { id: p.id }, data: { price: newPrice } });
//         console.log(`${p.id} Updated`);
//     }
// }

// updatePrices();

// async function insertData() {
//     const ps = await db.product.createMany({
//         data:
//         [
//             {
//                 "name": "Smart Plug",
//                 "description": "Wi-Fi smart plug that allows you to control devices from your phone or voice assistant.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 24.99,
//                 "category": "Home Appliances"
//             },
//             {
//                 "name": "Ceramic Dinnerware Set",
//                 "description": "12-piece ceramic dinnerware set, includes plates, bowls, and mugs. Dishwasher and microwave safe.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 59.99,
//                 "category": "Kitchen"
//             },
//             {
//                 "name": "Luxurious Bathrobe",
//                 "description": "Soft and absorbent bathrobe made from high-quality cotton. Available in multiple sizes.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 69.99,
//                 "category": "Bedding"
//             },
//             {
//                 "name": "Modern Wall Clock",
//                 "description": "Sleek and modern wall clock with silent movement and easy-to-read numbers.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 29.99,
//                 "category": "Home Decor"
//             },
//             {
//                 "name": "Standing Floor Mirror",
//                 "description": "Full-length standing floor mirror with a sturdy frame. Perfect for bedrooms and dressing rooms.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 129.99,
//                 "category": "Furniture"
//             },
//             {
//                 "name": "Silicone Baking Mat",
//                 "description": "Reusable non-stick silicone baking mat for easy and healthy cooking.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 19.99,
//                 "category": "Kitchen"
//             },
//             {
//                 "name": "Heated Blanket",
//                 "description": "Electric heated blanket with adjustable temperature settings and auto-shutoff.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 89.99,
//                 "category": "Bedding"
//             },
//             {
//                 "name": "Desk Organizer Set",
//                 "description": "5-piece desk organizer set including a tray, pen holder, and file organizer.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 34.99,
//                 "category": "Home Organization"
//             },
//             {
//                 "name": "Stainless Steel Toaster",
//                 "description": "2-slice stainless steel toaster with multiple browning settings and defrost function.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 49.99,
//                 "category": "Kitchen"
//             },
//             {
//                 "name": "Velvet Sofa",
//                 "description": "Elegant velvet sofa with plush cushions and a sturdy frame. Available in various colors.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 599.99,
//                 "category": "Furniture"
//             },
//             {
//                 "name": "Abstract Canvas Art",
//                 "description": "Large abstract canvas art to add a modern touch to your living space.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 79.99,
//                 "category": "Home Decor"
//             },
//             {
//                 "name": "Motion Sensor Night Light",
//                 "description": "Battery-operated motion sensor night light for hallways, bathrooms, and bedrooms.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 19.99,
//                 "category": "Lighting"
//             },
//             {
//                 "name": "Portable Space Heater",
//                 "description": "Compact and efficient portable space heater with safety features.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 59.99,
//                 "category": "Home Appliances"
//             },
//             {
//                 "name": "Bamboo Bath Caddy",
//                 "description": "Adjustable bamboo bath caddy with slots for books, tablets, and wine glasses.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 39.99,
//                 "category": "Bedding"
//             },
//             {
//                 "name": "Non-Slip Area Rug",
//                 "description": "Stylish non-slip area rug, available in various sizes and designs.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 99.99,
//                 "category": "Home Decor"
//             },
//             {
//                 "name": "Recliner Chair",
//                 "description": "Comfortable recliner chair with adjustable backrest and footrest. Ideal for living rooms.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 299.99,
//                 "category": "Furniture"
//             },
//             {
//                 "name": "Stainless Steel Mixing Bowls",
//                 "description": "Set of 5 stainless steel mixing bowls with lids for all your cooking and baking needs.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 49.99,
//                 "category": "Kitchen"
//             },
//             {
//                 "name": "Comforter Set",
//                 "description": "7-piece comforter set including comforter, shams, bed skirt, and decorative pillows.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 119.99,
//                 "category": "Bedding"
//             },
//             {
//                 "name": "Cordless Electric Mop",
//                 "description": "Rechargeable cordless electric mop for effortless floor cleaning.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 159.99,
//                 "category": "Home Appliances"
//             },
//             {
//                 "name": "Adjustable Closet Organizer",
//                 "description": "Customizable closet organizer system with shelves, hanging rods, and drawers.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 199.99,
//                 "category": "Home Organization"
//             },
//             {
//                 "name": "Glass Food Storage Containers",
//                 "description": "Set of 10 glass food storage containers with airtight lids. Microwave and freezer safe.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 39.99,
//                 "category": "Kitchen"
//             },
//             {
//                 "name": "Electric Fireplace",
//                 "description": "Wall-mounted electric fireplace with adjustable flame settings and remote control.",
//                 sellerId: 2,
//                 image: "",
//                 "price": 349.99,
//                 "category": "Furniture"
//             },
//             {
//                 "name": "Macrame Wall Hanging",
//                 "description": "Handmade macrame wall hanging to add a boho touch to any room.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 34.99,
//                 "category": "Home Decor"
//             },
//             {
//                 "name": "Clip-On Desk Lamp",
//                 "description": "Flexible clip-on desk lamp with LED light and adjustable brightness.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 24.99,
//                 "category": "Lighting"
//             },
//             {
//                 "name": "Robot Vacuum Cleaner",
//                 "description": "Automated robot vacuum cleaner with Wi-Fi connectivity and app control.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 229.99,
//                 "category": "Home Appliances"
//             },
//             {
//                 "name": "Faux Fur Throw Blanket",
//                 "description": "Ultra-soft faux fur throw blanket for warmth and style.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 59.99,
//                 "category": "Bedding"
//             },
//             {
//                 "name": "Granite Mortar and Pestle",
//                 "description": "Heavy-duty granite mortar and pestle for grinding and mixing spices and herbs.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 29.99,
//                 "category": "Kitchen"
//             },
//             {
//                 "name": "Adjustable Laptop Stand",
//                 "description": "Ergonomic adjustable laptop stand for improved posture and comfort.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 39.99,
//                 "category": "Home Organization"
//             },
//             {
//                 "name": "LED String Lights",
//                 "description": "20-foot LED string lights with multiple modes and remote control.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 29.99,
//                 "category": "Lighting"
//             },
//             {
//                 "name": "Air Fryer",
//                 "description": "Large capacity air fryer for healthier frying with little to no oil.",
//                 sellerId: 6,
//                 image: "",
//                 "price": 99.99,
//                 "category": "Kitchen"
//             }
//         ]
        
//     })
// }

// insertData()