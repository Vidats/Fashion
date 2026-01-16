import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function PaymentSuccess() {
    const { orderId } = useParams();

    return (
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle size={80} className="text-green-500 animate-bounce" />
            </div>
            <h1 className="text-4xl font-black uppercase mb-4 text-slate-800">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-6 text-lg">
                Hệ thống đã nhận được đơn hàng của bạn và đang tiến hành xử lý.
            </p>

            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 inline-block mb-10">
                <p className="text-gray-500 text-sm uppercase font-bold tracking-widest mb-2">Mã đơn hàng của bạn</p>
                <p className="text-2xl font-mono font-bold text-blue-600">{orderId}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/"
                    className="bg-black text-white px-10 py-4 font-bold uppercase hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={20} /> Tiếp tục mua sắm
                </Link>
                <Link
                    to="/profile/orders"
                    className="border-2 border-black px-10 py-4 font-bold uppercase hover:bg-gray-100 transition-all"
                >
                    Xem đơn hàng của tôi
                </Link>
            </div>
        </div>
    );
}
