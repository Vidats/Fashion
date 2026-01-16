const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_DINARY_NAME,
    api_key: process.env.CLOUD_DINARY_API_KEY, 
    api_secret: process.env.CLOUD_DINARY_API_SECRET,
});

module.exports = cloudinary;