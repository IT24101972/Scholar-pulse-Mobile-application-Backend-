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
        const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
        const isPdf = fileExt === 'pdf';
        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt);
        
        let folder = 'scholarpulse/others';
        let resource_type = 'auto';

        if (isImage) {
            folder = 'scholarpulse/images';
            resource_type = 'image';
        } else if (isPdf) {
            folder = 'scholarpulse/documents';
            resource_type = 'raw'; // PDF files are best handled as 'raw' in Cloudinary to keep original format
        } else if (file.mimetype.startsWith('video/')) {
            folder = 'scholarpulse/videos';
            resource_type = 'video';
        }

        return {
            folder: folder,
            resource_type: resource_type,
            public_id: file.fieldname + '-' + Date.now(),
            format: isImage ? fileExt : undefined // Only force format for images
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
