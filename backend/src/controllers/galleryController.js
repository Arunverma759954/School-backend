import Gallery from '../models/Gallery.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add new gallery image (uploaded to Cloudinary CDN)
// @route   POST /api/gallery
// @access  Private/Admin
const addGallery = async (req, res) => {
    try {
        const { alt, category } = req.body;
        let finalSrc = '';

        // Priority 1: Multer-Cloudinary file upload (req.file.path = cloudinary URL)
        if (req.file && req.file.path) {
            finalSrc = req.file.path;
        }
        // Priority 2: Base64 fallback - upload directly to Cloudinary
        else if (req.body.src && req.body.src.startsWith('data:image')) {
            const result = await cloudinary.uploader.upload(req.body.src, {
                folder: 'school-gallery',
            });
            finalSrc = result.secure_url;
        }

        if (!finalSrc) {
            return res.status(400).json({ message: 'No image provided' });
        }

        const image = await Gallery.create({
            src: finalSrc,  // Cloudinary permanent https:// URL
            alt: alt || 'School Gallery Image',
            category: category || 'General',
        });

        res.status(201).json(image);
    } catch (error) {
        console.error('Gallery Upload Backend Error:', error);
        res.status(500).json({
            message: 'Server Error during upload',
            details: error.message,
        });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGallery = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (image) {
            // Delete from Cloudinary if it's a Cloudinary URL
            if (image.src && image.src.includes('cloudinary.com')) {
                try {
                    const parts = image.src.split('/');
                    const fileWithExt = parts[parts.length - 1];
                    const folder = parts[parts.length - 2];
                    const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudErr) {
                    console.warn('Cloudinary delete warning:', cloudErr.message);
                }
            }
            await image.deleteOne();
            res.json({ message: 'Image removed' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGallery = async (req, res) => {
    try {
        const { alt, category } = req.body;
        const image = await Gallery.findById(req.params.id);

        if (image) {
            image.alt = alt || image.alt;
            image.category = category || image.category;

            // If new file uploaded, update with new Cloudinary URL
            if (req.file && req.file.path) {
                image.src = req.file.path;
            }

            const updatedImage = await image.save();
            res.json(updatedImage);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { getGallery, addGallery, deleteGallery, updateGallery };
