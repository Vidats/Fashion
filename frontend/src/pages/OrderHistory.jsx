import React, { useState, useEffect } from 'react';
import { requestGetPaymentsByUser } from '../config/paymentRequest';
import { requestGetUserFeedbacks, requestCreateFeedback } from '../config/FeedbackRequest';
import { Link } from 'react-router-dom';

// Modal Component
const FeedbackModal = ({ isOpen, onClose, onSubmit, productId, paymentId }) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('content', content);
        formData.append('productId', productId);
        formData.append('paymentId', paymentId);
        for (let i = 0; i < images.length; i++) {
            formData.append('imagesFeedback', images[i]);
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Viết đánh giá</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Đánh giá (sao)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nội dung</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Hình ảnh</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [userFeedbacks, setUserFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({ productId: null, paymentId: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, feedbacksRes] = await Promise.all([
                    requestGetPaymentsByUser(),
                    requestGetUserFeedbacks(),
                ]);

                // Bảo vệ dữ liệu orders
                setOrders(ordersRes?.metadata || []);
                // feedbacksRes.metadata giờ là một mảng các ID sản phẩm đã được đánh giá
                setUserFeedbacks(feedbacksRes?.metadata || []);

                setLoading(false);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenModal = (productId, paymentId) => {
        setSelectedProduct({ productId, paymentId });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct({ productId: null, paymentId: null });
    };

    const handleFeedbackSubmit = async (formData) => {
        try {
            await requestCreateFeedback(formData);
            // Refresh lại danh sách feedback sau khi gửi
            const feedbacksRes = await requestGetUserFeedbacks();
            // feedbacksRes.metadata giờ là một mảng các ID sản phẩm đã được đánh giá
            setUserFeedbacks(feedbacksRes?.metadata || []);

            handleCloseModal();
            alert('Đánh giá của bạn đã được gửi thành công!');
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            // Hiển thị thông báo lỗi cụ thể từ backend nếu có
            const errorMessage = error.response?.data?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.';
            alert(errorMessage);
        }
    };

    if (loading) return <p className="text-center mt-8">Đang tải lịch sử đơn hàng...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">Lỗi: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Lịch sử Đơn hàng</h1>
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFeedbackSubmit}
                productId={selectedProduct.productId}
                paymentId={selectedProduct.paymentId}
            />

            {!orders || orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-bold text-lg">Đơn hàng #{order._id?.slice(-6) || 'N/A'}</p>
                                    <p className="text-sm text-gray-600">
                                        Ngày đặt:{' '}
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Tổng cộng:{' '}
                                        <span className="font-semibold">
                                            {(order.finalPrice || 0).toLocaleString()}đ
                                        </span>
                                    </p>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                                        order.status === 'pending'
                                            ? 'bg-yellow-500'
                                            : order.status === 'delivered'
                                              ? 'bg-green-500'
                                              : order.status === 'cancelled'
                                                ? 'bg-red-500'
                                                : 'bg-gray-500'
                                    }`}
                                >
                                    {order.status || 'unknown'}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Sản phẩm:</h4>
                                <div className="space-y-4">
                                    {/* Thêm Optional Chaining ở đây */}
                                    {order.products?.map((item, idx) => (
                                        <div
                                            key={item.productId?._id || idx}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={item.productId?.imagesProduct?.[0] || '/image/default-product.png'}
                                                    alt={item.productId?.nameProduct}
                                                    className="w-16 h-16 object-cover rounded mr-4"
                                                />
                                                <div>
                                                    {item.productId?._id ? (
                                                        <Link
                                                            to={`/product/${item.productId._id}`}
                                                            className="font-semibold hover:underline"
                                                        >
                                                            {item.productId.nameProduct || 'Sản phẩm không tên'}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-semibold">Sản phẩm không tồn tại</span>
                                                    )}
                                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                                </div>
                                            </div>

                                            {/* Logic hiển thị nút đánh giá */}
                                            {order.status === 'delivered' &&
                                                item.productId?._id &&
                                                (userFeedbacks.includes(item.productId._id) ? (
                                                    <span className="text-green-500 font-semibold italic text-sm">
                                                        Đã đánh giá
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenModal(item.productId._id, order._id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                                                    >
                                                        Viết đánh giá
                                                    </button>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
