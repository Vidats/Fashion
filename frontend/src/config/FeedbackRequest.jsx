import { apiClient } from './axiosClient'; // Sử dụng instance apiClient bạn đã tạo

/**
 * Gửi đánh giá mới cho sản phẩm
 * @param {FormData} formData - Phải dùng FormData vì có chứa file hình ảnh
 */
export const requestCreateFeedback = (formData) => {
    return apiClient.post('/feedback/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Lấy 4 đánh giá mới nhất cho trang chủ
 */
export const requestGetAllFeedbacks = () => {
    // Đảm bảo đường dẫn này khớp 100% với file routes/index.js của bạn
    return apiClient.get('/feedback/get');
};

/**
 * Lấy tất cả các đánh giá cho trang Admin
 */
export const requestGetAllFeedbacksForAdmin = () => {
    return apiClient.get('/feedback/get-all');
};

/**
 * Lấy danh sách đánh giá của chính User đang đăng nhập
 */
export const requestGetUserFeedbacks = () => {
    return apiClient.get('/feedback/get-user-feedback');
};

/**
 * Xóa một đánh giá
 * @param {string} feedbackId
 */
export const requestDeleteFeedback = (feedbackId) => {
    return apiClient.delete(`/feedback/delete/${feedbackId}`);
};
