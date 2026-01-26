import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/header.jsx';
import Banner from './components/banner.jsx';
import HomePage from './components/HomePage.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Auth from './pages/Auth.jsx';
import CartPage from './pages/CartPage.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import Footer from './components/Footer.jsx';

// Import các thành phần Admin
import AdminLayout from './pages/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import AdminCoupons from './pages/AdminCoupons.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminFeedbacks from './pages/AdminFeedbacks.jsx';
import { useAuth } from './config/AuthContext.jsx';

// App.jsx
const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    // 1. Lấy thông tin từ localStorage để check nhanh nếu Context chưa kịp load
    const storedUser = JSON.parse(localStorage.getItem('user_info'));
    const currentUser = user || storedUser;

    console.log('Admin Access Check:', currentUser);

    // 2. Nếu thực sự không có user hoặc không phải admin thì mới đuổi ra
    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    if (currentUser.isAdmin !== true) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <>
            <Header />
            <Routes>
                {/* --- NHÓM ROUTE NGƯỜI DÙNG --- */}
                <Route
                    path="/"
                    element={
                        <>
                            <Banner />
                            <HomePage />
                        </>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <>
                            <Banner />
                            <HomePage />
                        </>
                    }
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
                <Route path="/orders" element={<OrderHistory />} />

                {/* --- ROUTE ĐĂNG NHẬP --- */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />

                {/* --- NHÓM ROUTE ADMIN --- */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="feedbacks" element={<AdminFeedbacks />} />
                </Route>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
