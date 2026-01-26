const feedbackModel = require('../models/feedback.model');
const paymentModel = require('../models/payment.model');

const { NotFoundError, BadRequestError, ForbiddenError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

const cloudinary = require('../config/cloudDinary');

class FeedbackController {
    async createFeedback(req, res) {
        const id = req.user;
        const { paymentId, content, rating, productId } = req.body;
        const dataImages = req.files;
        const findPayment = await paymentModel.findById(paymentId);
        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const existingFeedback = await feedbackModel.findOne({ userId: id, productId });
        if (existingFeedback) {
            throw new BadRequestError('Bạn đã đánh giá sản phẩm này rồi.');
        }

        if (!findPayment) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }

        if (findPayment.status !== 'delivered') {
            throw new BadRequestError('Đơn hàng chưa hoàn thành');
        }

        let imagesFeedback = [];

        for (const image of dataImages) {
            const { path, filename } = image;
            const { url } = await cloudinary.uploader.upload(path, {
                folder: 'feedbacks',
                resource_type: 'image',
            });
            imagesFeedback.push(url || filename);
        }

        const newFeedback = await feedbackModel.create({
            userId: id,
            productId,
            content,
            rating: Number(rating),
            imagesFeedback,
        });

        return new Created({
            message: 'Đánh giá sản phẩm thành công',
            metadata: newFeedback,
        }).send(res);
    }
    // Trong feedback.controller.js
    async getAllFeedback(req, res) {
        const feedbacks = await feedbackModel
            .find()
            .populate('userId', 'fullName avatar') // Hiện tên người đánh giá
            .populate('productId', 'nameProduct imagesProduct') // Hiện tên sản phẩm họ đã mua
            .sort({ createdAt: -1 }); // Mới nhất hiện lên đầu

        return new OK({
            message: 'Lấy danh sách đánh giá công khai thành công',
            metadata: feedbacks,
        }).send(res);
    }
    // Trong feedback.controller.js
    async getLatestFeedback(req, res) {
        const feedbacks = await feedbackModel
            .find()
            .populate('userId', 'fullName avatar') // Hiện tên người đánh giá
            .populate('productId', 'nameProduct imagesProduct') // Hiện tên sản phẩm họ đã mua
            .sort({ createdAt: -1 }) // Mới nhất hiện lên đầu
            .limit(4); // Giới hạn 4 feeback

        return new OK({
            message: 'Lấy 4 đánh giá mới nhất thành công',
            metadata: feedbacks,
        }).send(res);
    }

    // Lấy feedback của riêng từng User
    async getFeedbackInUser(req, res) {
        const userId = req.user; // Lấy từ middleware authUser
        const feedbacks = await feedbackModel.find({ userId }).select('productId').lean();
        const reviewedProductIds = feedbacks.map((fb) => fb.productId.toString());
        return new OK({ message: 'Thành công', metadata: reviewedProductIds }).send(res);
    }

    // Xóa feedback
    async deleteFeedback(req, res) {
        const { feedbackId } = req.params;
        const deletedFeedback = await feedbackModel.findByIdAndDelete(feedbackId);

        if (!deletedFeedback) throw new NotFoundError('Không tìm thấy đánh giá');

        return new OK({ message: 'Xóa đánh giá thành công' }).send(res);
    }
}

module.exports = new FeedbackController();
