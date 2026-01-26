import { useEffect, useState } from 'react';
import { apiClient } from '../config/axiosClient';
import RevenueChart from '../components/RevenueChart';
import OrderStatusChart from '../components/OrderStatusChart';

export default function Dashboard() {
    const [stats, setStats] = useState([
        { label: 'Tổng doanh thu', value: '0đ', color: 'bg-green-500' },
        { label: 'Sản phẩm', value: '0', color: 'bg-blue-500' },
        { label: 'Đơn hàng', value: '0', color: 'bg-orange-500' },
        { label: 'Khách hàng', value: '0', color: 'bg-purple-500' },
    ]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/dashboard/stats');
                const {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                    revenueByDay,
                    orderStatusDistribution,
                } = response.data.metadata;

                setStats([
                    {
                        label: 'Tổng doanh thu',
                        value: `${totalRevenue.toLocaleString('vi-VN')}đ`,
                        color: 'bg-green-500',
                    },
                    { label: 'Sản phẩm', value: totalProducts, color: 'bg-blue-500' },
                    { label: 'Đơn hàng', value: totalOrders, color: 'bg-orange-500' },
                    { label: 'Khách hàng', value: totalUsers, color: 'bg-purple-500' },
                ]);

                setChartData({ revenueByDay, orderStatusDistribution });
            } catch (err) {
                setError('Không thể tải dữ liệu thống kê.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div key={index} className={`${item.color} text-white p-6 rounded-lg shadow-md`}>
                        <p className="text-sm opacity-80 uppercase font-bold">{item.label}</p>
                        <p className="text-3xl font-bold mt-2">{item.value}</p>
                    </div>
                ))}
            </div>

            {chartData && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <RevenueChart data={chartData.revenueByDay} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <OrderStatusChart data={chartData.orderStatusDistribution} />
                    </div>
                </div>
            )}
        </div>
    );
}
