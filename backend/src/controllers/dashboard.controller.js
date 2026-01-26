const { OK } = require('../core/success.response');
const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');
const PaymentModel = require('../models/payment.model');

class DashboardController {
    async getStats(req, res, next) {
        try {
            // Total counts
            const totalUsers = await UserModel.countDocuments();
            const totalProducts = await ProductModel.countDocuments();
            const totalOrders = await PaymentModel.countDocuments();

            // Total revenue
            const revenueResult = await PaymentModel.aggregate([
                { $match: { status: 'delivered' } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$finalPrice' },
                    },
                },
            ]);
            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            // Revenue by day for the last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const revenueByDay = await PaymentModel.aggregate([
                {
                    $match: {
                        status: 'delivered',
                        createdAt: { $gte: sevenDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        dailyRevenue: { $sum: '$finalPrice' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            // Order status distribution
            const orderStatusDistribution = await PaymentModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]);

            return new OK({
                message: 'Lấy dữ liệu thống kê thành công',
                metadata: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                    revenueByDay,
                    orderStatusDistribution,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DashboardController();
