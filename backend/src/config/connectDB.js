const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối thành công với MongoDB');
    } catch (error) {
        console.error('❌ Kết nối thất bại với MongoDB:', error.message);
    }
};

module.exports = connectDB;
