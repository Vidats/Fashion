import { useEffect, useState } from 'react';
import { listUsers } from '../config/UserRequest';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await listUsers();
            setUsers(res.metadata);
        } catch (error) {
            console.error('Lỗi tải danh sách người dùng:', error);
            alert('Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Quản lý Khách hàng</h1>
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b">
                            <tr>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Ngày đăng ký</th>
                                <th className="p-4">Quyền hạn</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-sm">{user.fullName}</td>
                                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="p-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.isAdmin
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                        >
                                            {user.isAdmin ? 'Admin' : 'Khách hàng'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
