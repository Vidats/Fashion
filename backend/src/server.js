require('dotenv').config(); // Luôn đặt ở dòng đầu tiên

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/connectDB');
const routes = require('./routes');

const app = express();

// CHỈNH SỬA 1: Render cấp cổng tự động qua biến PORT, không dùng cố định 3000
const port = process.env.PORT || 3000;

/* ===== Middleware ===== */
app.use(
    cors({
        // CHỈNH SỬA 2: Thêm link Frontend sau khi deploy vào đây để tránh lỗi CORS
        origin: ['http://localhost:5173', 'http://localhost:5174', 'https://fashion-1-nou8.onrender.com'],
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

/* ===== MongoDB ===== */
// Đảm bảo hàm này được gọi sau khi dotenv đã load
connectDB();

/* ===== Routes ===== */
routes(app);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        metadata: { message: 'Server is Live!' },
    });
});

/* ===== Error Handler ===== */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server',
    });
});

/* ===== Start Server ===== */
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại cổng: ${port}`);
});

// Kiểm tra biến môi trường trong Log của Render
console.log('--- Kiểm tra cấu hình ---');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
