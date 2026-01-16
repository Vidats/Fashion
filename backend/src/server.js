const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const connectDB = require('./config/connectDB');
const routes = require('./routes');
const cors = require('cors');
const app = express();
const port = 3000;

/* ===== Middleware ===== */
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===== MongoDB ===== */
connectDB();

/* ===== Routes ===== */
routes(app);

const morgan = require('morgan');
app.use(morgan('dev'));

app.get('/', (req, res) => {
    return res.json({
        success: true,
        metadata: { message: 'OK' },
    });
});

/* ===== Error Handler (LUÔN CUỐI) ===== */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server',
    });
});

/* ===== Start Server ===== */
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
