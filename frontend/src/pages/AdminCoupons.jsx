import { useEffect, useState } from 'react';
import { listCoupons, requestCreateCoupon, requestUpdateCoupon, requestDeleteCoupon } from '../config/CouponRequest';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nameCoupon: '',
        discount: '',
        quantity: '',
        startDate: '',
        endDate: '',
        minPrice: '',
    });

    const loadCoupons = async () => {
        try {
            const res = await listCoupons();
            setCoupons(res.metadata);
        } catch (error) {
            console.error('Lỗi tải mã giảm giá:', error);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                nameCoupon: coupon.nameCoupon,
                discount: coupon.discount,
                quantity: coupon.quantity,
                startDate: formatDateForInput(coupon.startDate),
                endDate: formatDateForInput(coupon.endDate),
                minPrice: coupon.minPrice,
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                nameCoupon: '',
                discount: '',
                quantity: '',
                startDate: '',
                endDate: '',
                minPrice: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            ...formData,
            discount: Number(formData.discount),
            quantity: Number(formData.quantity),
            minPrice: Number(formData.minPrice),
        };

        try {
            if (editingCoupon) {
                await requestUpdateCoupon(editingCoupon._id, dataToSend);
                alert('Cập nhật mã giảm giá thành công!');
            } else {
                await requestCreateCoupon(dataToSend);
                alert('Tạo mã giảm giá thành công!');
            }
            handleCloseModal();
            loadCoupons();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Lỗi không mong muốn'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
            try {
                await requestDeleteCoupon(id);
                alert('Xóa mã giảm giá thành công!');
                loadCoupons();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.message || 'Lỗi không mong muốn'));
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Quản lý Mã giảm giá</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
                >
                    <Plus size={20} /> Thêm mã
                </button>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b">
                        <tr>
                            <th className="p-4">Mã</th>
                            <th className="p-4">Giảm (%)</th>
                            <th className="p-4">Số lượng</th>
                            <th className="p-4">Điều kiện</th>
                            <th className="p-4">Hiệu lực</th>
                            <th className="p-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {coupons.map((c) => (
                            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-sm uppercase">{c.nameCoupon}</td>
                                <td className="p-4 text-red-500 font-bold">{c.discount}%</td>
                                <td className="p-4">{c.quantity}</td>
                                <td className="p-4 text-xs">
                                    Đơn tối thiểu <br />
                                    <span className="font-bold">{c.minPrice.toLocaleString()}đ</span>
                                </td>
                                <td className="p-4 text-xs">
                                    {formatDateForInput(c.startDate)} <br /> {formatDateForInput(c.endDate)}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(c)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-full"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c._id)}
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
                        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="font-black uppercase">
                                {editingCoupon ? 'Cập nhật Mã giảm giá' : 'Tạo mới Mã giảm giá'}
                            </h2>
                            <button type="button" onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Mã coupon</label>
                                <input
                                    required
                                    className="w-full border-b-2 py-2 outline-none focus:border-black"
                                    value={formData.nameCoupon}
                                    onChange={(e) => setFormData({ ...formData, nameCoupon: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Giảm giá (%)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full border-b-2 py-2 outline-none focus:border-black"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Số lượng</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full border-b-2 py-2 outline-none focus:border-black"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                             <div>
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Ngày bắt đầu</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full border-b-2 py-2 outline-none focus:border-black"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Ngày kết thúc</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full border-b-2 py-2 outline-none focus:border-black"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                             <div className="col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Giá trị đơn hàng tối thiểu</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full border-b-2 py-2 outline-none focus:border-black"
                                    value={formData.minPrice}
                                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                                />
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
