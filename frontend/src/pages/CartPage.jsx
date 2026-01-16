import { useEffect, useState } from 'react';
import {
    requestGetCart,
    requestUpdateQuantity,
    requestDeleteProductCart,
    requestApplyCounpon,
} from '../config/CartRequest';
import { Trash2, Plus, Minus, ArrowLeft, Ticket, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    // ✅ State để bật/tắt hiển thị giảm giá ở giao diện
    const [isCouponActive, setIsCouponActive] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await requestGetCart();
            setCart(res.metadata.cart);
            setCoupons(res.metadata.coupons);
            // Nếu có finalPrice từ server, mặc định luôn cho phép hiển thị
            if (res.metadata.cart.finalPrice > 0) {
                setIsCouponActive(true);
            }
        } catch (error) {
            console.error('Lỗi lấy giỏ hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleApplyCoupon = async (couponId) => {
        try {
            await requestApplyCounpon({ couponId });
            alert('Áp dụng mã giảm giá thành công! 🎉');
            setIsCouponActive(true); // Tự động bật lại hiển thị khi chọn mã mới
            fetchCart();
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể áp dụng mã này');
        }
    };

    const handleUpdateQuantity = async (productId, currentQuantity) => {
        if (currentQuantity < 1) return;
        try {
            const data = { productId, newQuantity: currentQuantity };
            await requestUpdateQuantity(data);
            await fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Lỗi cập nhật số lượng:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            try {
                await requestDeleteProductCart(productId);
                fetchCart();
                window.dispatchEvent(new Event('cartUpdated'));
            } catch (error) {
                alert('Lỗi khi xóa sản phẩm');
            }
        }
    };

    if (loading) return <div className="text-center py-20 font-bold">Đang tải giỏ hàng...</div>;

    if (!cart || cart.products.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
                <Link to="/products" className="text-blue-600 flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-black uppercase mb-10 border-b pb-4">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {/* Danh sách sản phẩm */}
                    {/* Danh sách sản phẩm - Đã thêm kiểm tra an toàn */}
                    {cart.products.map((item) => {
                        // Nếu productId bị null, trả về null để không hiển thị dòng lỗi này
                        if (!item.productId) return null;

                        return (
                            <div key={item._id} className="flex gap-6 border-b pb-6 items-center">
                                <img
                                    src={item.productId?.imagesProduct?.[0] || 'https://via.placeholder.com/150'}
                                    alt={item.productId?.nameProduct || 'Sản phẩm không tồn tại'}
                                    className="w-24 h-32 object-cover bg-gray-100"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold uppercase text-lg">
                                        {item.productId?.nameProduct || 'Sản phẩm đã ngừng kinh doanh'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-2">
                                        Size: {item.productId?.metadata?.size || 'N/A'} | Màu:{' '}
                                        {item.productId?.metadata?.color || 'N/A'}
                                    </p>
                                    <p className="font-black">
                                        {Number(item.productId?.priceProduct || 0).toLocaleString()}đ
                                    </p>
                                </div>

                                {/* Các nút bấm giữ nguyên nhưng dùng item.productId._id an toàn */}
                                <div className="flex items-center border rounded">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.productId?._id, item.quantity - 1)}
                                        className="p-2 border rounded-l hover:bg-gray-100"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 py-2 border-t border-b font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.productId?._id, item.quantity + 1)}
                                        className="p-2 border rounded-r hover:bg-gray-100"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.productId?._id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        );
                    })}

                    <div className="mt-10">
                        <h3 className="font-bold uppercase mb-4 flex items-center gap-2">
                            <Ticket size={20} /> Mã giảm giá khả dụng
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {coupons.map((cp) => (
                                <div
                                    key={cp._id}
                                    className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex justify-between items-center bg-white"
                                >
                                    <div>
                                        <p className="font-bold text-blue-600">{cp.nameCoupon}</p>
                                        <p className="text-xs text-gray-500">
                                            Giảm {cp.discount}% cho đơn từ {Number(cp.minPrice).toLocaleString()}đ
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleApplyCoupon(cp._id)}
                                        className="bg-blue-600 text-white px-3 py-1 text-sm font-bold rounded hover:bg-blue-700"
                                    >
                                        Dùng ngay
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="bg-gray-50 p-8 h-fit sticky top-24 border">
                    <h2 className="text-xl font-bold mb-6 uppercase">Tóm tắt đơn hàng</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span>Tạm tính:</span>
                            <span>{Number(cart.totalPrice).toLocaleString()}đ</span>
                        </div>

                        {/* ✅ LOGIC TẮT MÃ GIẢM GIÁ Ở ĐÂY */}
                        {cart.finalPrice > 0 && cart.finalPrice < cart.totalPrice && isCouponActive ? (
                            <div className="flex justify-between items-center text-green-600 font-bold bg-green-50 p-3 rounded-md">
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400">Đã áp dụng mã giảm giá</p>
                                    <span>-{(cart.totalPrice - cart.finalPrice).toLocaleString()}đ</span>
                                </div>
                                <button
                                    onClick={() => setIsCouponActive(false)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="Tạm tắt mã"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        ) : cart.finalPrice > 0 && !isCouponActive ? (
                            <button
                                onClick={() => setIsCouponActive(true)}
                                className="w-full text-xs text-blue-600 border border-blue-600 border-dashed py-2 rounded hover:bg-blue-50"
                            >
                                💡 Nhấn để sử dụng lại mã giảm giá?
                            </button>
                        ) : null}

                        <div className="border-t pt-4 flex justify-between font-black text-2xl text-red-600">
                            <span>Tổng cộng:</span>
                            <span>
                                {/* ✅ Thay đổi giá hiển thị dựa trên state isCouponActive */}
                                {isCouponActive
                                    ? Number(cart.finalPrice || cart.totalPrice).toLocaleString()
                                    : Number(cart.totalPrice).toLocaleString()}
                                đ
                            </span>
                        </div>
                    </div>
                    <Link
                        to="/checkout"
                        className="w-full bg-black text-white py-4 font-bold uppercase hover:bg-gray-800 transition-colors flex justify-center items-center"
                    >
                        Tiến hành thanh toán
                    </Link>
                </div>
            </div>
        </div>
    );
}
