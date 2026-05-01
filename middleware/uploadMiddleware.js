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

// Set up Cloudinary storage with fix for double encoding
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Decode the filename in case it's already encoded by the mobile app
        const decodedName = decodeURIComponent(file.originalname);
        const fileExt = path.extname(decodedName).toLowerCase();
        const fileNameOnly = path.parse(decodedName).name.replace(/[^a-zA-Z0-9]/g, '_'); // Replace spaces/special chars with underscores
        
        let folder = 'scholarpulse/others';
        if (fileExt === '.pdf') {
            folder = 'scholarpulse/documents';
        } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
            folder = 'scholarpulse/images';
        }

        return {
            folder: folder,
            resource_type: 'auto',
            // Use a sanitized public_id to avoid encoding issues
            public_id: fileNameOnly + '-' + Date.now(),
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
