import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header.jsx';
import Banner from './components/banner.jsx';
import HomePage from './components/HomePage.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Auth from './pages/Auth.jsx';
import CartPage from './pages/CartPage.jsx';
import Checkout from './pages/Checkout.jsx'; // Sửa import đúng file
import PaymentSuccess from './pages/PaymentSuccess.jsx'; // Tạo file này riêng
import Footer from './components/Footer.jsx';

// Import các thành phần Admin
import AdminLayout from './pages/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { getUser } from './utils/auth.js';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';

const AdminRoute = ({ children }) => {
    const user = getUser();
    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <>
            <Routes>
                {/* --- NHÓM ROUTE NGƯỜI DÙNG --- */}
                <Route
                    path="/*"
                    element={
                        <>
                            <Header />
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <main className="max-w-7xl mx-auto px-4 py-8">
                                            <Banner />
                                            <HomePage />
                                        </main>
                                    }
                                />
                                <Route
                                    path="/products"
                                    element={
                                        <main className="max-w-7xl mx-auto px-4 py-8">
                                            <Banner />
                                            <HomePage />
                                        </main>
                                    }
                                />
                                <Route
                                    path="/product/:id"
                                    element={
                                        <main className="max-w-7xl mx-auto px-4 py-8">
                                            <ProductDetail />
                                        </main>
                                    }
                                />
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/cart" element={<CartPage />} />

                                {/* Thêm Route Checkout */}
                                <Route path="/checkout" element={<Checkout />} />

                                {/* Route thành công phải nằm ở đây để khách hàng xem được */}
                                <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
                            </Routes>
                            <Footer />
                        </>
                    }
                />

                {/* --- NHÓM ROUTE ADMIN --- */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    {/* Trang chủ Admin */}
                    <Route index element={<Dashboard />} />

                    {/* Quản lý sản phẩm - Đã thay thế div bằng AdminProducts */}
                    <Route path="products" element={<AdminProducts />} />

                    {/* Quản lý đơn hàng */}
                    <Route path="orders" element={<AdminOrders />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
