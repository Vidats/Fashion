import request from './request';

const apiCategory = '/category';

export const listCategory = async () => {
    const res = await request.get(`${apiCategory}/list`);
    return res.data;
};

export const requestCreateCategory = async (data) => {
    const res = await request.post(`${apiCategory}/create`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const requestUpdateCategory = async (id, data) => {
    const res = await request.put(`${apiCategory}/update/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const requestDeleteCategory = async (id) => {
    const res = await request.delete(`${apiCategory}/delete/${id}`);
    return res.data;
};
