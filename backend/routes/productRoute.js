import express from 'express'
import { listProducts, addProduct, removeProduct, updateProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const productRouter = express.Router();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Route: Upload image via Cloudinary
const memoryUpload = multer({ storage: multer.memoryStorage() });
productRouter.post('/upload', adminAuth, memoryUpload.single('image'), async (req, res) => {
    try {
        const streamUpload = () =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });

        const result = await streamUpload();
        res.json({ success: true, imageUrl: result.secure_url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Upload thất bại' });
    }
});

// Existing product routes
productRouter.post('/add', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
]), addProduct);

productRouter.post('/update-img', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
]), updateProduct);

productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/update', adminAuth, updateProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

export default productRouter;
