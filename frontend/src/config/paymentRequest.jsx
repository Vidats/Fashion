import request from './request';
import { apiClient } from './axiosClient';

const apiPayment = '/payment';

export const requestPayment = async (data) => {
    const res = await apiClient.post(`${apiPayment}/create`, data);
    return res.data;
};

export const requestPaymentById = async (orderId) => {
    const res = await apiClient.get(`${apiPayment}/order/${orderId}`);
    return res.data;
};
// 2. Lấy danh sách đơn hàng cho Admin (SỬA Ở ĐÂY)
export const requestGetPaymentsAdmin = async () => {
    const res = await apiClient.get(`${apiPayment}/admin/list`); // Khớp với router.get('/admin/list')
    return res.data;
};

// 3. Cập nhật trạng thái đơn hàng (SỬA Ở ĐÂY)
export const requestUpdateStatus = async (orderId, status) => {
    const res = await apiClient.put(`${apiPayment}/admin/update/${orderId}`, { status }); // Khớp với router.put('/admin/update/:orderId')
    return res.data;
};

// 4. Xem chi tiết 1 đơn hàng (SỬA Ở ĐÂY)
export const requestGetPaymentDetail = async (orderId) => {
    const res = await apiClient.get(`${apiPayment}/order/${orderId}`); // Khớp với router.get('/order/:orderId')
    return res.data;
};
