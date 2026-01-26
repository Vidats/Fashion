import { useEffect, useState } from 'react';
import {
    listCategory,
    requestCreateCategory,
    requestUpdateCategory,
    requestDeleteCategory,
} from '../config/CategoryRequest';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nameCategory: '',
    });

    const loadCategories = async () => {
        try {
            const res = await listCategory();
            setCategories(res.metadata);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                nameCategory: category.nameCategory,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                nameCategory: '',
            });
        }
        setFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ nameCategory: '' });
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nameCategory || (!file && !editingCategory)) {
            alert('Vui lòng điền tên danh mục và chọn một ảnh.');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('nameCategory', formData.nameCategory);

        if (file) {
            data.append('imageCategory', file);
        }

        try {
            if (editingCategory) {
                await requestUpdateCategory(editingCategory._id, data);
                alert('Cập nhật danh mục thành công!');
            } else {
                await requestCreateCategory(data);
                alert('Tạo danh mục thành công!');
            }
            handleCloseModal();
            loadCategories();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Lỗi không mong muốn'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await requestDeleteCategory(id);
                alert('Xóa danh mục thành công!');
                loadCategories();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.message || 'Lỗi không mong muốn'));
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Quản lý Danh mục</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
                >
                    <Plus size={20} /> Thêm danh mục
                </button>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b">
                        <tr>
                            <th className="p-4">Danh mục</th>
                            <th className="p-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 flex items-center gap-4">
                                    <img
                                        src={cat.imageCategory}
                                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                                        alt={cat.nameCategory}
                                    />
                                    <div>
                                        <p className="font-bold text-sm uppercase">{cat.nameCategory}</p>
                                        <p className="text-xs text-gray-400">{cat._id}</p>
                                    </div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(cat)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-full"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-full"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="font-black uppercase">
                                {editingCategory ? 'Cập nhật Danh mục' : 'Tạo mới Danh mục'}
                            </h2>
                            <button type="button" onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">
                                    Tên danh mục
                                </label>
                                <input
                                    required
                                    className="w-full border-b-2 py-2 outline-none focus:border-black transition-all"
                                    value={formData.nameCategory}
                                    onChange={(e) => setFormData({ ...formData, nameCategory: e.target.value })}
                                    placeholder="Ví dụ: Đồng hồ nam"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">
                                    Hình ảnh
                                </label>
                                <label className="flex-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                    <Upload className="text-gray-400 mb-2" size={28} />
                                    <span className="text-xs font-bold text-gray-500">
                                        {file ? file.name : 'Tải ảnh lên'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </label>
                                {editingCategory && !file && (
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500 mb-2">Ảnh hiện tại:</p>
                                        <img
                                            src={editingCategory.imageCategory}
                                            className="w-24 h-24 object-cover rounded-lg"
                                            alt="Current"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-8 py-2 font-bold uppercase text-xs text-gray-500 hover:text-black"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-black text-white font-black uppercase text-xs rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
                            >
                                {loading ? 'Đang xử lý...' : 'Lưu lại'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
