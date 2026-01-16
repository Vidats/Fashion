import { useState } from 'react';
import { requestForgotPassword, requestVerifyForgotPassword } from '../config/UserRequest';

export default function ForgotPassword({ onBack }) {
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & Pass mới
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Bước 1: Gửi yêu cầu OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            await requestForgotPassword(email);
            setMessage({ type: 'success', text: 'Mã OTP đã gửi về Email của bạn!' });
            setStep(2);
        } catch (err) {
            setMessage({ type: 'error', text: 'Email không tồn tại hoặc lỗi hệ thống' });
        }
    };

    // Bước 2: Xác nhận OTP và đổi mật khẩu
    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await requestVerifyForgotPassword({ otp, password: newPassword });
            alert('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
            onBack(); // Quay lại trang Login
        } catch (err) {
            setMessage({ type: 'error', text: 'Mã OTP không đúng hoặc đã hết hạn' });
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">{step === 1 ? 'Quên mật khẩu' : 'Thiết lập mật khẩu mới'}</h2>

            {message.text && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}

            {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        className="w-full border px-4 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="w-full bg-black text-white py-2 font-bold">Gửi mã OTP</button>
                </form>
            ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Mã OTP (6 số)"
                        className="w-full border px-4 py-2"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="w-full border px-4 py-2"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button className="w-full bg-blue-600 text-white py-2 font-bold">Xác nhận đổi mật khẩu</button>
                </form>
            )}

            <button onClick={onBack} className="w-full text-sm text-gray-500 hover:underline">
                Quay lại đăng nhập
            </button>
        </div>
    );
}
