import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, getProductsBySeller, search, updateProduct } from "../controllers/product.js";
import { validateCreateProduct, validateProductUpdate } from "../middleware/product.js";
import { justDecodeTokenIfExist, validateSeller, validateToken } from "../middleware/auth.js";
import multerUpload, { multerErrorHandler } from "../middleware/multerUpload.js";


const productRouter = Router();

productRouter.get("/", justDecodeTokenIfExist, getProducts);
productRouter.get("/:id", justDecodeTokenIfExist, getProductById);
productRouter.get("/search", search);

productRouter.use(validateToken);

// import multer from "multer";
// const multerUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 } });

const single = multerUpload.single('image');

productRouter.post("/", validateSeller, (req, res, next) => {
    single(req, res, (err) => {
        if (err) {
            return multerErrorHandler(err, req, res, next);
        }
        next();
    });
}, validateCreateProduct, addProduct);
productRouter.get("/seller", validateSeller, getProductsBySeller);
productRouter.delete("/:id", validateSeller, deleteProduct);
productRouter.put("/:id", validateSeller, (req, res, next) => {
    single(req, res, (err) => {
        if (err) {
            return multerErrorHandler(err, req, res, next);
        }
        next();
    });
}, validateProductUpdate, updateProduct);

export default productRouter;