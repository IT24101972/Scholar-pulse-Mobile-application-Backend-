const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Get extension (e.g., pdf, jpg) without the dot
        const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
        
        return {
            folder: 'scholarpulse/uploads',
            resource_type: 'auto',
            // Use only the filename without extension for public_id
            // Cloudinary will automatically add the correct extension based on 'format'
            public_id: path.parse(file.originalname).name + '-' + Date.now(),
            format: fileExt || undefined,
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
