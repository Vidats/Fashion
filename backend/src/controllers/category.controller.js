const cloudinary = require('../config/cloudDinary');
const categoryModel = require('../models/category.model');
const { Created, OK } = require('../core/success.response');
const { BadRequestError, NotFoundError } = require('../core/error.response');

const fs = require('fs/promises');

const getPublicId = require('../utils/getPublicId');

class CategoryController {
    async createCategory(req, res) {
        const { nameCategory } = req.body;

        // Kiểm tra nếu không có file hoặc thiếu tên
        if (!req.file || !nameCategory) {
            if (req.file) await fs.unlink(req.file.path);
            throw new BadRequestError('Thiếu thông tin danh mục hoặc hình ảnh');
        }

        const { path } = req.file;

        try {
            // Tùy chọn folder ở đây
            const result = await cloudinary.uploader.upload(path, {
                folder: 'my_app/categorys', // Cloudinary sẽ tự tạo folder này nếu chưa có
                resource_type: 'image',
            });

            const newCategory = await categoryModel.create({
                nameCategory,
                imageCategory: result.secure_url, // Lưu URL an toàn (https)
            });

            // Xóa file tạm sau khi upload thành công
            await fs.unlink(path);

            return new Created({
                message: 'Tạo danh mục thành công',
                metadata: newCategory,
            }).send(res);
        } catch (error) {
            // Nếu lỗi, vẫn phải xóa file tạm
            await fs.unlink(path);
            throw error;
        }
    }

    async getAllCategory(req, res) {
        const categories = await categoryModel.find();
        return new OK({
            message: 'Lấy danh mục thành công',
            metadata: categories,
        }).send(res);
    }

    async updateCategory(req, res) {
        const { id } = req.params;
        const { nameCategory } = req.body;

        // 1. Kiểm tra đầu vào cơ bản
        if (!nameCategory || !id) {
            if (req.file) await fs.unlink(req.file.path); // Xóa file tạm nếu có gửi lên mà thiếu ID/Name
            throw new BadRequestError('Thiếu thông tin danh mục');
        }

        // 2. Tìm danh mục trong Database
        const findCategory = await categoryModel.findById(id);
        if (!findCategory) {
            if (req.file) await fs.unlink(req.file.path);
            throw new NotFoundError('Danh mục không tồn tại');
        }

        let imageCategory = findCategory.imageCategory; // Mặc định giữ lại URL cũ

        // 3. Xử lý nếu người dùng có upload ảnh mới
        if (req.file) {
            const { path } = req.file;

            try {
                // Upload ảnh mới lên Cloudinary
                const result = await cloudinary.uploader.upload(path, {
                    folder: 'my_app/categorys', // Thống nhất folder với hàm Create
                    resource_type: 'image',
                });

                // Lấy Public ID của ảnh CŨ trước khi ghi đè URL mới
                const oldImagePublicId = getPublicId(findCategory.imageCategory);

                // Cập nhật URL ảnh MỚI vào biến để lưu DB
                imageCategory = result.secure_url;

                // Xóa file tạm ở server local (máy của bạn)
                await fs.unlink(path);

                // XÓA ẢNH CŨ trên Cloudinary để giải phóng bộ nhớ
                if (oldImagePublicId) {
                    await cloudinary.uploader.destroy(oldImagePublicId);
                }
            } catch (error) {
                // Nếu upload lỗi, xóa file tạm local và quăng lỗi
                await fs.unlink(path);
                throw error;
            }
        }

        // 4. Cập nhật thông tin mới vào Database
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { nameCategory, imageCategory },
            { new: true },
        );

        return new OK({
            message: 'Cập nhật danh mục thành công',
            metadata: updatedCategory,
        }).send(res);
    }

    async deleteCategory(req, res) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError('Thiếu thông tin danh mục');
        }

        const findCategory = await categoryModel.findById(id);

        if (!findCategory) {
            throw new NotFoundError('Danh mục không tồn tại');
        }

        await cloudinary.uploader.destroy(getPublicId(findCategory.imageCategory));

        await findCategory.deleteOne();

        return new OK({
            message: 'Xóa danh mục thành công',
            metadata: findCategory,
        }).send(res);
    }
}

module.exports = new CategoryController();
