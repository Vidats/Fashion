import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-slate-800">SHOP ADMIN</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-2 hover:bg-slate-800 rounded">
                        📊 Dashboard
                    </Link>
                    <Link to="/admin/products" className="block px-4 py-2 hover:bg-slate-800 rounded">
                        📦 Sản phẩm
                    </Link>
                    <Link to="/admin/orders" className="block px-4 py-2 hover:bg-slate-800 rounded">
                        📑 Đơn hàng
                    </Link>
                    <Link to="/" className="block px-4 py-2 hover:bg-slate-800 rounded border-t border-slate-800 pt-4">
                        🏠 Về trang Shop
                    </Link>
                </nav>
                <button onClick={handleLogout} className="p-4 bg-red-600 hover:bg-red-700 text-left font-bold">
                    🚪 Đăng xuất
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-end items-center">
                    <span className="text-gray-600 mr-2">Xin chào, Admin</span>
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </header>
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
