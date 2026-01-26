import Cookies from 'js-cookie';

const USER_KEY = 'user_info';
const LOGGED_KEY = 'logged';

// Lưu khi đăng nhập thành công
export const saveAuth = (metadata) => {
    // metadata ở đây chính là object to đùng bạn vừa gửi (có user, accessToken...)
    if (metadata && metadata.user) {
        // Chỉ lưu thông tin user (có fullName, email, isAdmin...) vào LocalStorage
        localStorage.setItem(USER_KEY, JSON.stringify(metadata.user));
    }

    // Cookie dùng để đánh dấu trạng thái login cho Axios
    Cookies.set(LOGGED_KEY, '1', { expires: 7 });
};

// Lấy thông tin user để hiển thị lên Header ✅
export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Hàm đăng xuất xóa sạch dấu vết ✅
export const logout = () => {
    localStorage.removeItem(USER_KEY);
    Cookies.remove(LOGGED_KEY);
};
