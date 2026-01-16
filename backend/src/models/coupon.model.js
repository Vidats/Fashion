const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const couponModel = new Schema(
    {
        nameCoupon: { type: String, require: true },
        discount: { type: Number, require: true }, // 10 (%)
        quantity: { type: Number, require: true },
        startDate: { type: Date, require: true },
        endDate: { type: Date, require: true },
        minPrice: { type: Number, require: true }, // 500.000đ
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('coupon', couponModel);
