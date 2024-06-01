import multer from "multer";

const multerUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024*1024 } });

export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size is too large. Maximum size allowed is 1MB.' });
        }
    }
    next(err);
};

export default multerUpload;