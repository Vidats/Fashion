import { useEffect, useState } from 'react';
import { requestGetPaymentsAdmin, requestGetPaymentDetail, requestUpdateStatus } from '../config/PaymentRequest';
import { Eye, Package, X, Calendar, User, MapPin, CreditCard, Clock } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await requestGetPaymentsAdmin();
            setOrders(res.metadata);
        } catch (error) {
            console.error('Lỗi tải danh sách đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Hàm mở modal và tải chi tiết đơn hàng
    const handleViewDetail = async (orderId) => {
        try {
            const res = await requestGetPaymentDetail(orderId);
            setSelectedOrder(res.metadata);
            setIsModalOpen(true);
        } catch (error) {
            alert('Không thể lấy chi tiết đơn hàng');
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await requestUpdateStatus(orderId, status);
            alert('Cập nhật trạng thái thành công!');
            fetchOrders(); // Cập nhật lại danh sách bên ngoài
            setIsModalOpen(false);
        } catch (error) {
            alert('Lỗi cập nhật trạng thái');
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                <Package className="text-blue-600" /> Quản lý vận đơn
            </h1>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b">
                        <tr>
                            <th className="p-4">Ngày đặt</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Tổng tiền</th>
                            <th className="p-4">Phương thức</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold">{order.fullName}</div>
                                    <div className="text-[10px] text-gray-400">{order.phoneNumber}</div>
                                </td>
                                <td className="p-4 font-black text-blue-600">
                                    {(order.finalPrice || order.totalPrice).toLocaleString()}đ
                                </td>
                                <td className="p-4">
                                    <span className="text-[10px] px-2 py-1 bg-gray-100 rounded font-bold uppercase">
                                        {order.paymentMethod}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase 
                                        ${
                                            order.status === 'pending'
                                                ? 'bg-amber-100 text-amber-700'
                                                : order.status === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail(order._id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL CHI TIẾT ĐƠN HÀNG */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="font-black uppercase tracking-tighter text-lg">Chi tiết đơn hàng</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-all"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Thông tin giao hàng */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <User size={14} /> Khách hàng & Liên hệ
                                    </h3>
                                    <p className="font-bold text-lg">{selectedOrder.fullName}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.phoneNumber}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <MapPin size={14} /> Địa chỉ nhận hàng
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-3 rounded-lg border border-dashed">
                                        {selectedOrder.address}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <CreditCard size={14} /> Thanh toán
                                    </h3>
                                    <p className="text-sm uppercase font-black text-blue-600">
                                        {selectedOrder.paymentMethod}
                                    </p>
                                </section>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                    <Package size={14} /> Sản phẩm đã đặt
                                </h3>
                                <div className="border rounded-xl overflow-hidden bg-gray-50">
                                    <div className="max-h-48 overflow-y-auto p-4 space-y-3">
                                        {selectedOrder.products.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-800">
                                                        {item.productId?.nameProduct}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 italic">
                                                        Số lượng: {item.quantity}
                                                    </p>
                                                </div>
                                                <span className="font-bold">
                                                    {(item.productId?.priceProduct * item.quantity).toLocaleString()}đ
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white border-t space-y-1">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Tạm tính:</span>
                                            <span>{selectedOrder.totalPrice.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex justify-between font-black text-xl text-red-600 pt-2">
                                            <span>Tổng tiền:</span>
                                            <span>
                                                {(
                                                    selectedOrder.finalPrice || selectedOrder.totalPrice
                                                ).toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cập nhật trạng thái */}
                                <div className="space-y-3 pt-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                                        <Clock size={14} /> Trạng thái đơn hàng
                                    </h3>
                                    <select
                                        className="w-full border-2 p-3 rounded-xl font-bold outline-none focus:border-blue-600 transition-all cursor-pointer"
                                        defaultValue={selectedOrder.status}
                                        onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                                    >
                                        <option value="pending">Chờ xác nhận</option>
                                        <option value="shipped">Đang giao hàng</option>
                                        <option value="delivered">Đã giao thành công</option>
                                        <option value="cancelled">Hủy đơn hàng</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
