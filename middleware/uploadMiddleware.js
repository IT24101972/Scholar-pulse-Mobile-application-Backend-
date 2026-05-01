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
        const fileType = file.mimetype.split('/')[0]; // image, video, application
        let folder = 'scholarpulse/others';
        let resource_type = 'auto';

        if (fileType === 'image') folder = 'scholarpulse/images';
        else if (fileType === 'video') {
            folder = 'scholarpulse/videos';
            resource_type = 'video';
        }
        else if (file.mimetype === 'application/pdf') folder = 'scholarpulse/documents';

        return {
            folder: folder,
            resource_type: resource_type,
            public_id: file.fieldname + '-' + Date.now(),
            format: path.extname(file.originalname).substring(1) || undefined
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
