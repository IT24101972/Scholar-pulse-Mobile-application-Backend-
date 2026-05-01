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
        const fileExt = path.extname(file.originalname).toLowerCase(); // includes the dot (e.g., .pdf)
        const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt);
        
        let folder = 'scholarpulse/others';
        if (isImage) folder = 'scholarpulse/images';
        else if (fileExt === '.pdf') folder = 'scholarpulse/documents';
        else if (file.mimetype.startsWith('video/')) folder = 'scholarpulse/videos';

        return {
            folder: folder,
            resource_type: 'auto', // Most flexible option
            // We append the extension to the public_id to ensure it's in the URL
            public_id: path.parse(file.originalname).name + '-' + Date.now() + fileExt,
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
