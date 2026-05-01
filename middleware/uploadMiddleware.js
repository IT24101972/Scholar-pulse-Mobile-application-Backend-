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
        const fileExt = path.extname(file.originalname).toLowerCase();
        
        return {
            folder: 'scholarpulse/uploads',
            // Using 'raw' ensures the URL will have /raw/upload/ instead of /image/upload/
            resource_type: 'raw',
            // For 'raw' files, we must manually include the extension in public_id
            public_id: path.parse(file.originalname).name + '-' + Date.now() + fileExt,
            access_mode: 'public',
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
