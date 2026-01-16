import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestGetCart, requestUpdateInfoCart } from '../config/CartRequest';
import { requestPayment } from '../config/paymentRequest'; // File bạn vừa gửi
import { CreditCard, Truck, Wallet, MapPin, Phone, User, Mail } from 'lucide-react';

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Form thông tin giao hàng (Khớp với updateInfoCart ở Backend)
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        email: '',
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await requestGetCart();
                const cartData = res.metadata.cart;

                if (cartData.products.length === 0) {
                    alert('Giỏ hàng trống!');
                    return navigate('/cart');
                }

                setCart(cartData);
                // Điền sẵn thông tin nếu giỏ hàng đã có dữ liệu từ trước
                setShippingInfo({
                    fullName: cartData.fullName || '',
                    phoneNumber: cartData.phoneNumber || '',
                    address: cartData.address || '',
                    email: cartData.email || '',
                });
            } catch (error) {
                navigate('/cart');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const handleInputChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            // Bước 1: Cập nhật thông tin địa chỉ/sđt vào giỏ hàng trước
            await requestUpdateInfoCart(shippingInfo);

            // Bước 2: Gọi API thanh toán
            const res = await requestPayment({ typePayment: paymentMethod });

            if (res.statusCode === 201) {
                if (paymentMethod === 'cod') {
                    // Nếu là COD, Backend trả về object đơn hàng mới
                    alert('Đặt hàng thành công!');
                    navigate(`/payment-success/${res.metadata._id}`);
                } else {
                    // Nếu là VNPay/Momo, Backend trả về URL thanh toán (metadata là string/url)
                    // res.metadata chính là link: https://sandbox.vnpayment.vn/...
                    const paymentUrl = typeof res.metadata === 'string' ? res.metadata : res.metadata.payUrl;
                    window.location.href = paymentUrl;
                }
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi xử lý đơn hàng');
        }
    };

    if (loading) return <div className="text-center py-20 font-bold">Đang tải...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-black uppercase mb-10 border-b pb-4 text-slate-800">Thanh toán đơn hàng</h1>

            <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* BÊN TRÁI: THÔNG TIN KHÁCH HÀNG */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="text-blue-600" size={20} /> Thông tin nhận hàng
                        </h2>
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    required
                                    name="fullName"
                                    value={shippingInfo.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Họ và tên người nhận"
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        required
                                        name="phoneNumber"
                                        value={shippingInfo.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Số điện thoại"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <textarea
                                    required
                                    name="address"
                                    value={shippingInfo.address}
                                    onChange={handleInputChange}
                                    placeholder="Địa chỉ giao hàng chi tiết (Số nhà, đường, phường/xã...)"
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-28"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Chọn phương thức thanh toán</h2>
                        <div className="space-y-3">
                            <label
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                                    paymentMethod === 'cod'
                                        ? 'border-blue-600 bg-blue-50 shadow-inner'
                                        : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Truck className="text-slate-600" />
                                    <span className="font-semibold text-slate-700">Thanh toán khi nhận hàng (COD)</span>
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </label>

                            <label
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                                    paymentMethod === 'vnpay'
                                        ? 'border-blue-600 bg-blue-50 shadow-inner'
                                        : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <CreditCard className="text-blue-600" />
                                    <span className="font-semibold text-slate-700">Cổng thanh toán VNPay</span>
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="vnpay"
                                    checked={paymentMethod === 'vnpay'}
                                    onChange={() => setPaymentMethod('vnpay')}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </label>

                            <label
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                                    paymentMethod === 'momo'
                                        ? 'border-blue-600 bg-blue-50 shadow-inner'
                                        : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Wallet className="text-pink-600" />
                                    <span className="font-semibold text-slate-700">Ví điện tử Momo</span>
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="momo"
                                    checked={paymentMethod === 'momo'}
                                    onChange={() => setPaymentMethod('momo')}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </label>
                        </div>
                    </section>
                </div>

                {/* BÊN PHẢI: TỔNG KẾT ĐƠN HÀNG */}
                <div className="h-fit sticky top-28">
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4 uppercase tracking-wider">
                            Chi tiết đơn hàng
                        </h2>
                        <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.products.map((item) => (
                                <div key={item._id} className="flex justify-between items-start">
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-200">{item.productId.nameProduct}</p>
                                        <p className="text-slate-400">Số lượng: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold">
                                        {(item.productId.priceProduct * item.quantity).toLocaleString()}đ
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-slate-700 pt-6">
                            <div className="flex justify-between text-slate-400">
                                <span>Tạm tính:</span>
                                <span>{Number(cart.totalPrice).toLocaleString()}đ</span>
                            </div>
                            {cart.finalPrice > 0 && cart.finalPrice < cart.totalPrice && (
                                <div className="flex justify-between text-green-400 font-medium">
                                    <span>Giảm giá:</span>
                                    <span>-{(cart.totalPrice - cart.finalPrice).toLocaleString()}đ</span>
                                </div>
                            )}
                            <div className="flex justify-between text-2xl font-black pt-2 text-white">
                                <span>Tổng cộng:</span>
                                <span className="text-yellow-400">
                                    {Number(cart.finalPrice || cart.totalPrice).toLocaleString()}đ
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                        >
                            {paymentMethod === 'cod' ? 'Xác nhận đặt hàng' : 'Thanh toán ngay'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
