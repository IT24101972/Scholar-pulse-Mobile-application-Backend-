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
        // Get extension from original name to be safe
        const originalName = file.originalname;
        const fileExt = path.extname(originalName).toLowerCase();
        
        let folder = 'scholarpulse/others';
        if (fileExt === '.pdf') folder = 'scholarpulse/documents';
        else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) folder = 'scholarpulse/images';

        return {
            folder: folder,
            resource_type: 'raw', // Use raw to keep the exact file content
            // Force the public_id to include the original filename with extension
            public_id: `${Date.now()}-${originalName}`,
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
