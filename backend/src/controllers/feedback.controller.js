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
            .populate('userId', 'name avatar') // Hiện tên người đánh giá
            .populate('productId', 'nameProduct thumb') // Hiện tên sản phẩm họ đã mua
            .sort({ createdAt: -1 }); // Mới nhất hiện lên đầu

        return new OK({
            message: 'Lấy danh sách đánh giá công khai thành công',
            metadata: feedbacks,
        }).send(res);
    }
    // Lấy feedback của riêng từng User
    async getFeedbackInUser(req, res) {
        const userId = req.user; // Lấy từ middleware authUser
        const feedbacks = await feedbackModel
            .find({ userId })
            .populate('productId', 'name thumb')
            .sort({ createdAt: -1 });
        return new OK({ message: 'Thành công', metadata: feedbacks }).send(res);
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
