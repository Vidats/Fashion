import React, { useState, useEffect } from 'react';
import { requestGetAllFeedbacks } from '../config/FeedbackRequest';

// Star rating component
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
            </span>
        );
    }
    return <div className="flex">{stars}</div>;
};

const LatestFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await requestGetAllFeedbacks();
                console.log('Feedback API Response:', response.data); // Để debug
                if (response && response.data && Array.isArray(response.data.metadata)) {
                    setFeedbacks(response.data.metadata);
                } else {
                    console.error('Dữ liệu feedback không hợp lệ:', response.data);
                    setFeedbacks([]); // Đặt lại thành mảng rỗng để tránh lỗi
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading feedback...</div>;
    }

    if (error) {
        return null; // Don't render the section if there's an error
    }

    // Guard clause mạnh mẽ hơn để đảm bảo feedbacks là một mảng
    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
        return null; // Don't render if there are no feedbacks or if it's not an array
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                    Khách hàng nói gì về chúng tôi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {feedbacks.map((feedback) => (
                        <div key={feedback._id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <img
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                    src={feedback.userId?.avatar || '/image/per.png'}
                                    alt={feedback.userId?.name || 'User'}
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{feedback.userId?.fullName || 'Anonymous'}</p>
                                    <p className="text-sm text-gray-500">
                                        Đã mua {(feedback.productId?.nameProduct || 'sản phẩm').substring(0, 20)}...
                                     </p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <StarRating rating={feedback.rating} />
                            </div>
                            <p className="text-gray-600 text-sm flex-grow">"{feedback.content}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LatestFeedback;
