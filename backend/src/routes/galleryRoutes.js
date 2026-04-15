import express from 'express';
import { getGallery, addGallery, deleteGallery, updateGallery } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
    .get(getGallery)
    .post(protect, admin, uploadToCloudinary.single('image'), addGallery);

router.route('/:id')
    .put(protect, admin, uploadToCloudinary.single('image'), updateGallery)
    .delete(protect, admin, deleteGallery);

export default router;
