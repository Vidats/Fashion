import { useEffect, useState } from 'react';
import {
    listProduct,
    requestCreateProduct,
    requestUpdateProduct,
    requestDeleteProduct,
} from '../config/ProductRequest';
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from 'lucide-react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nameProduct: '',
        priceProduct: '',
        discountProduct: 0,
        stockProduct: '',
        descriptionProduct: '',
        categoryProduct: '', // Phải là ID của Category
        color: '',
        size: '',
    });

    const loadProducts = async () => {
        try {
            const res = await listProduct();
            setProducts(res.metadata);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                nameProduct: product.nameProduct,
                priceProduct: product.priceProduct,
                discountProduct: product.discountProduct,
                stockProduct: product.stockProduct,
                descriptionProduct: product.descriptionProduct,
                categoryProduct: product.categoryProduct?._id || product.categoryProduct,
                color: product.metadata?.color || '',
                size: product.metadata?.size || '',
            });
        } else {
            setEditingProduct(null);
            setFormData({
                nameProduct: '',
                priceProduct: '',
                discountProduct: 0,
                stockProduct: '',
                descriptionProduct: '',
                categoryProduct: '',
                color: '',
                size: '',
            });
        }
        setFiles([]);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();

        // 1. Thêm các trường text
        data.append('nameProduct', formData.nameProduct);
        data.append('priceProduct', Number(formData.priceProduct));
        data.append('discountProduct', Number(formData.discountProduct));
        data.append('stockProduct', Number(formData.stockProduct));
        data.append('descriptionProduct', formData.descriptionProduct);
        data.append('categoryProduct', formData.categoryProduct);

        // 2. Metadata gửi dưới dạng string JSON cho Backend parse
        data.append(
            'metadata',
            JSON.stringify({
                color: formData.color,
                size: formData.size,
            }),
        );

        // 3. Xử lý ảnh - Tên trường 'imagesProduct' phải khớp với Backend
        if (files.length > 0) {
            Array.from(files).forEach((file) => {
                data.append('imagesProduct', file);
            });
        }

        try {
            if (editingProduct) {
                // Gửi mảng ảnh cũ để Backend xử lý update
                data.append('oldImagesProduct', JSON.stringify(editingProduct.imagesProduct));
                await requestUpdateProduct(editingProduct._id, data);
            } else {
                if (files.length === 0) return alert('Vui lòng chọn ít nhất 1 ảnh');
                await requestCreateProduct(data);
            }
            setIsModalOpen(false);
            loadProducts();
            alert('Thành công!');
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Unexpected error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Quản lý kho hàng</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
                >
                    <Plus size={20} /> Thêm sản phẩm
                </button>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 border-b">
                        <tr>
                            <th className="p-4">Sản phẩm</th>
                            <th className="p-4">Giá / Giảm giá</th>
                            <th className="p-4">Tồn kho</th>
                            <th className="p-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 flex items-center gap-4">
                                    <img
                                        src={p.imagesProduct?.[0]}
                                        className="w-12 h-16 object-cover rounded-lg bg-gray-100"
                                        alt=""
                                    />
                                    <div>
                                        <p className="font-bold text-sm uppercase">{p.nameProduct}</p>
                                        <p className="text-[10px] text-gray-400">
                                            {p.categoryProduct?.nameCategory || 'Chưa phân loại'}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-black text-sm">{p.priceProduct?.toLocaleString()}đ</p>
                                    <p className="text-red-500 text-xs">-{p.discountProduct}%</p>
                                </td>
                                <td className="p-4 text-sm font-medium text-gray-600">{p.stockProduct}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(p)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-full"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
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

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <h2 className="font-black uppercase italic">
                                {editingProduct ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-all"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                        Tên sản phẩm
                                    </label>
                                    <input
                                        required
                                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-all"
                                        value={formData.nameProduct}
                                        onChange={(e) => setFormData({ ...formData, nameProduct: e.target.value })}
                                        placeholder="Ví dụ: Giày Sneaker Nam..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                            Giá bán
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black"
                                            value={formData.priceProduct}
                                            onChange={(e) => setFormData({ ...formData, priceProduct: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                            Giảm giá (%)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black"
                                            value={formData.discountProduct}
                                            onChange={(e) =>
                                                setFormData({ ...formData, discountProduct: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                            Tồn kho
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black"
                                            value={formData.stockProduct}
                                            onChange={(e) => setFormData({ ...formData, stockProduct: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                            Danh mục (ID)
                                        </label>
                                        <input
                                            required
                                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black"
                                            value={formData.categoryProduct}
                                            onChange={(e) =>
                                                setFormData({ ...formData, categoryProduct: e.target.value })
                                            }
                                            placeholder="Dán ID danh mục vào đây"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                        Mô tả chi tiết
                                    </label>
                                    <textarea
                                        className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-black min-h-[100px]"
                                        value={formData.descriptionProduct}
                                        onChange={(e) =>
                                            setFormData({ ...formData, descriptionProduct: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                            Màu sắc
                                        </label>
                                        <input
                                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                                            Kích thước
                                        </label>
                                        <input
                                            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black"
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">
                                        Hình ảnh sản phẩm
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <label className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                                            <Upload className="text-gray-300 mb-1" size={24} />
                                            <span className="text-[10px] font-bold text-gray-400">TẢI ẢNH LÊN</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => setFiles(e.target.files)}
                                            />
                                        </label>
                                        {files.length > 0 && (
                                            <span className="text-xs font-bold text-green-600">
                                                +{files.length} ảnh
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-2 font-bold uppercase text-xs tracking-widest text-gray-400 hover:text-black"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-3 bg-black text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-lg shadow-black/10"
                            >
                                {loading ? 'Đang xử lý...' : editingProduct ? 'Cập nhật kho' : 'Đăng sản phẩm'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
