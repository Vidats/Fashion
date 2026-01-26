import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../config/AuthContext';
import { requestGetCart } from '../config/CartRequest';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { user, logout } = useAuth(); // Sử dụng hook
    const navigate = useNavigate();

    const fetchCartData = async () => {
        if (!user) {
            setCartCount(0);
            return;
        }
        try {
            const res = await requestGetCart();
            if (res.metadata && res.metadata.cart) {
                const totalTypes = res.metadata.cart.products.length;
                setCartCount(totalTypes);
            }
        } catch (error) {
            console.error('Lỗi lấy giỏ hàng:', error);
            setCartCount(0);
        }
    };

    useEffect(() => {
        fetchCartData();
        window.addEventListener('cartUpdated', fetchCartData);

        return () => {
            window.removeEventListener('cartUpdated', fetchCartData);
        };
    }, [user]); // user là dependency, khi user thay đổi (đăng nhập/xuất), sẽ fetch lại giỏ hàng

    const handleLogout = () => {
        logout(); // Gọi hàm logout từ context
        navigate('/auth'); // Điều hướng về trang đăng nhập
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            ShopHub
                        </Link>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Trang chủ
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-blue-600">
                            Sản phẩm
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Danh mục
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Về chúng tôi
                        </Link>
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* ✅ CẬP NHẬT GIỎ HÀNG */}
                        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                            <span className="text-xl">🛒</span>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Order History Link */}
                        {user && (
                             <Link to="/orders" className="p-2 text-gray-700 hover:text-blue-600">
                                <span className="text-xl">🧾</span>
                            </Link>
                        )}

                        {/* USER / LOGIN */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Nếu là Admin thì hiện nút vào Admin Panel */}
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        Quản trị
                                    </Link>
                                )}
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-gray-800">Chào, {user.fullName}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[10px] text-red-500 underline uppercase tracking-wider"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="p-2 text-gray-700 hover:text-blue-600 flex items-center gap-1 font-medium"
                            >
                                👤 <span className="text-sm">Đăng nhập</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav className="md:hidden pb-4 space-y-2 bg-gray-50 px-4">
                    <Link to="/" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                        Trang chủ
                    </Link>
                    <Link to="/products" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                        Sản phẩm
                    </Link>
                    {user && user.isAdmin && (
                        <Link
                            to="/admin"
                            className="block py-2 text-blue-600 font-bold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Quản trị hệ thống
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}
