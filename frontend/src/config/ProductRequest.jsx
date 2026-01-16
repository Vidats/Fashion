import request from './request';
const apiProduct = 'product/';

// Lấy danh sách sản phẩm
export const listProduct = async () => {
    const res = await request.get(`${apiProduct}list`);
    return res.data;
};

// Tạo sản phẩm mới (Sử dụng FormData cho hình ảnh)
export const requestCreateProduct = async (formData) => {
    const res = await request.post(`${apiProduct}create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

// Cập nhật sản phẩm
export const requestUpdateProduct = async (id, formData) => {
    const res = await request.put(`${apiProduct}update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-center' },
    });
    return res.data;
};

// Xóa sản phẩm
export const requestDeleteProduct = async (id) => {
    const res = await request.delete(`${apiProduct}delete/${id}`);
    return res.data;
};

// Lấy chi tiết sản phẩm
export const requestProductById = async (id) => {
    const res = await request.get(`${apiProduct}detail/${id}`);
    return res.data;
};
