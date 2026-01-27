const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // ĐỔI TÊN BIẾN TẠI ĐÂY: MONGODB_URI -> MONGO_URI
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Kết nối thành công với MongoDB');
    } catch (error) {
        console.error('❌ Kết nối thất bại với MongoDB:', error.message);
    }
};

module.exports = connectDB;
