import React, { useState, useEffect } from 'react';
import { requestGetAllFeedbacksForAdmin } from '../config/FeedbackRequest';

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await requestGetAllFeedbacksForAdmin();
                // Đảm bảo feedbacks luôn là mảng, nếu metadata null/undefined thì lấy mảng rỗng
                setFeedbacks(response.data.metadata || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Đánh giá</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Người dùng</th>
                                <th className="py-3 px-6 text-left">Sản phẩm</th>
                                <th className="py-3 px-6 text-center">Đánh giá (sao)</th>
                                <th className="py-3 px-6 text-left">Nội dung</th>
                                <th className="py-3 px-6 text-center">Hình ảnh</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {/* Thêm kiểm tra Array.isArray để cực kỳ an toàn */}
                            {Array.isArray(feedbacks) &&
                                feedbacks.map((feedback) => (
                                    <tr
                                        key={feedback._id || Math.random()}
                                        className="border-b border-gray-200 hover:bg-gray-100"
                                    >
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={feedback.userId?.avatar || '/image/per.png'}
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <span>{feedback.userId?.fullName || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    {/* Sử dụng optional chaining kỹ hơn cho thumb */}
                                                    <img
                                                        className="w-8 h-8"
                                                        src={
                                                            feedback.productId?.imagesProduct?.[0] ||
                                                            '/image/default-product.png'
                                                        }
                                                        alt="Product"
                                                    />
                                                </div>
                                                <span>{feedback.productId?.nameProduct || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs">
                                                {feedback.rating || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <p className="max-w-xs break-words">
                                                {feedback.content || 'Không có nội dung'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex item-center justify-center">
                                                {/* Đảm bảo imagesFeedback là mảng trước khi map */}
                                                {Array.isArray(feedback.imagesFeedback) &&
                                                    feedback.imagesFeedback.map((image, index) => (
                                                        <img
                                                            key={index}
                                                            className="w-10 h-10 rounded-md transform hover:scale-125 transition-transform"
                                                            src={image}
                                                            alt="Feedback"
                                                        />
                                                    ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedbacks;
