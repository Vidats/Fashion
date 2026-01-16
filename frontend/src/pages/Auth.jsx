import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestLogin, requestRegister } from '../config/UserRequest';
import { saveAuth } from '../utils/auth';
import ForgotPassword from './ForgotPassword'; // Bạn tạo file này từ code tôi đưa ở trên

export default function Auth() {
    const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (mode === 'login') {
                const res = await requestLogin({ email: form.email, password: form.password });
                saveAuth(res.metadata);
                navigate('/');
            } else if (mode === 'register') {
                await requestRegister(form);
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                setMode('login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Thông tin không hợp lệ');
        }
    };

    // Nếu đang ở chế độ quên mật khẩu, hiển thị giao diện riêng
    if (mode === 'forgot') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white w-full max-w-md p-8 shadow-lg">
                    <ForgotPassword onBack={() => setMode('login')} />
                </div>
            </div>
        );
    }

    // Giao diện Đăng nhập / Đăng ký
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white w-full max-w-md p-8 shadow-lg">
                {/* Toggle giữa Đăng nhập và Đăng ký */}
                <div className="flex mb-6 border-b">
                    <button
                        className={`flex-1 py-2 font-bold transition-colors ${
                            mode === 'login' ? 'border-b-2 border-black' : 'text-gray-400'
                        }`}
                        onClick={() => {
                            setMode('login');
                            setError('');
                        }}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`flex-1 py-2 font-bold transition-colors ${
                            mode === 'register' ? 'border-b-2 border-black' : 'text-gray-400'
                        }`}
                        onClick={() => {
                            setMode('register');
                            setError('');
                        }}
                    >
                        Đăng ký
                    </button>
                </div>

                {/* Form xử lý chung */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <input
                            name="fullName"
                            placeholder="Họ và tên"
                            className="w-full border px-4 py-2 focus:outline-none focus:border-black"
                            onChange={handleChange}
                            required
                        />
                    )}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full border px-4 py-2 focus:outline-none focus:border-black"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full border px-4 py-2 focus:outline-none focus:border-black"
                        onChange={handleChange}
                        required
                    />

                    {/* Nút Quên mật khẩu chỉ hiện khi ở chế độ Đăng nhập */}
                    {mode === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800 transition-colors">
                        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
}
