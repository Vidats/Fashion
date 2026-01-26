import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, saveAuth, logout as logoutUtil } from '../utils/auth';

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Khi component được mount lần đầu, kiểm tra xem có thông tin user trong localStorage không
    useEffect(() => {
        const storedUser = getUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Hàm để đăng nhập
    const login = (userData) => {
        // 1. Lưu vào LocalStorage (truyền cả metadata để saveAuth tự tách)
        saveAuth(userData);

        // 2. Cập nhật state 'user' trong Context
        // Quan trọng: Phải lấy userData.user vì API của bạn bọc user bên trong
        if (userData && userData.user) {
            setUser(userData.user);
            console.log('Admin Check:', userData.user.isAdmin); // Log thử xem có ra 'true' không
        }
    };
    // Hàm để đăng xuất
    const logout = () => {
        logoutUtil(); // Xóa khỏi localStorage/cookie
        setUser(null); // Cập nhật state
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Tạo custom hook để sử dụng context dễ dàng hơn
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
