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

// Set up Cloudinary storage with dynamic folder selection
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const fileExt = path.extname(file.originalname).toLowerCase();
        
        let folder = 'scholarpulse/others';
        if (fileExt === '.pdf') {
            folder = 'scholarpulse/documents';
        } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
            folder = 'scholarpulse/images';
        }

        return {
            folder: folder,
            resource_type: 'auto', // Let Cloudinary handle the headers correctly
            // We use the original filename to keep things clear
            public_id: path.parse(file.originalname).name + '-' + Date.now(),
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
