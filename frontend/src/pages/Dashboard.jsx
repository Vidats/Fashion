export default function Dashboard() {
    const stats = [
        { label: 'Tổng doanh thu', value: '125,000,000đ', color: 'bg-green-500' },
        { label: 'Sản phẩm', value: '450', color: 'bg-blue-500' },
        { label: 'Đơn hàng mới', value: '12', color: 'bg-orange-500' },
        { label: 'Khách hàng', value: '1,200', color: 'bg-purple-500' },
    ];

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
        </div>
    );
}
