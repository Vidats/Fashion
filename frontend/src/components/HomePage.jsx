import { useEffect, useState } from 'react';
import { listCategory } from '../config/CategoryRequest';
import { listProduct } from '../config/ProductRequest';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { requestGetAllFeedbacks } from '../config/FeedbackRequest';

function HomePage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);

    // File: HomePage.jsx
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Gán đúng thứ tự biến trả về
                // Bạn phải gán kết quả trả về đúng biến trong mảng
                const [catRes, prodRes, feedRes] = await Promise.all([
                    listCategory(),
                    listProduct(),
                    requestGetAllFeedbacks(),
                ]);
                setFeedbacks(feedRes.metadata || []);

                setCategories(catRes.metadata || []);
                setProducts(prodRes.metadata || []);
                setFeedbacks(feedRes.metadata || []); // feedRes đã có dữ liệu từ requestGetAllFeedbacks
            } catch (err) {
                console.error('Lỗi tải dữ liệu:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ✅ FIX ĐÚNG FIELD categoryProduct
    const filteredProducts = selectedCategory
        ? products.filter((prod) => prod.categoryProduct === selectedCategory)
        : products;

    if (loading) return <div className="text-center py-8">⏳ Đang tải dữ liệu...</div>;

    if (error) return <div className="text-red-500 text-center py-8">❌ Lỗi: {error}</div>;

    return (
        <div className="bg-[#f9f9f9] min-h-screen pb-20">
            {/* --- Danh mục sản phẩm --- */}
            {/* --- Danh mục sản phẩm (Đã sửa thành 5 vòng tròn hàng ngang) --- */}
            <div className="max-w-7xl mx-auto pt-16 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight text-center uppercase">
                    Danh mục sản phẩm
                </h2>

                {/* Nút tất cả - Thu nhỏ lại để hợp với layout mới */}
                <div className="mb-10 flex justify-center">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-5 py-1.5 text-xs font-bold uppercase border transition ${
                            selectedCategory === null
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                    >
                        Tất cả
                    </button>
                </div>

                {/* Grid 5 cột cho vòng tròn */}
                <div className="grid grid-cols-5 gap-4 md:gap-8 max-w-4xl mx-auto">
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className="group cursor-pointer flex flex-col items-center"
                        >
                            {/* Vòng tròn ảnh */}
                            <div
                                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                                    selectedCategory === cat._id
                                        ? 'border-black scale-110 shadow-lg'
                                        : 'border-transparent bg-gray-100'
                                }`}
                            >
                                <img
                                    src={cat.imageCategory}
                                    alt={cat.nameCategory}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                            </div>

                            {/* Tên danh mục nhỏ gọn */}
                            <p
                                className={`mt-3 text-center text-[10px] sm:text-xs font-bold uppercase tracking-tighter transition ${
                                    selectedCategory === cat._id ? 'text-black' : 'text-gray-500 group-hover:text-black'
                                }`}
                            >
                                {cat.nameCategory}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Sản phẩm --- */}
            <div className="max-w-7xl mx-auto mt-24 px-4">
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                        {selectedCategory ? 'Sản phẩm theo danh mục' : 'Tất cả sản phẩm'}
                    </h2>
                    <div className="h-1.5 w-24 bg-black"></div>
                </div>

                {filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500">Không có sản phẩm trong danh mục này</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {filteredProducts.map((prod) => (
                            <div key={prod._id} className="group flex flex-col">
                                {/* ✅ BỌC LINK CHI TIẾT */}
                                <Link to={`/product/${prod._id}`}>
                                    <div className="relative bg-[#f3f3f3] aspect-[4/5] overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                                        <img
                                            src={prod.imagesProduct?.[0] || 'https://via.placeholder.com/400'}
                                            alt={prod.nameProduct}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                                        />
                                    </div>
                                </Link>

                                <button className="mt-2 bg-black text-white py-3 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                                    <ShoppingCart size={16} />
                                    Thêm vào giỏ hàng
                                </button>

                                <div className="mt-6 text-center px-2">
                                    <Link to={`/product/${prod._id}`}>
                                        <h3 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-tight line-clamp-1 hover:underline">
                                            {prod.nameProduct}
                                        </h3>
                                    </Link>

                                    <span className="text-lg font-black text-black tracking-tighter">
                                        {Number(prod.priceProduct).toLocaleString()}đ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- PHẦN FEEDBACK --- */}
            <div className="max-w-7xl mx-auto mt-32 px-4">
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                        Trải nghiệm khách hàng
                    </h2>
                    <div className="h-1.5 w-24 bg-black"></div>
                </div>

                {feedbacks.length === 0 ? (
                    <p className="text-center text-gray-500 italic">Chưa có đánh giá nào từ khách hàng.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {feedbacks.map((fb) => (
                            <div
                                key={fb._id}
                                className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex mb-4 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < fb.rating ? 'currentColor' : 'none'}
                                            className={i < fb.rating ? '' : 'text-gray-200'}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-600 italic leading-relaxed mb-6 flex-grow">"{fb.content}"</p>

                                {/* Hiển thị ảnh feedback nếu có */}
                                {fb.imagesFeedback?.length > 0 && (
                                    <div className="flex gap-2 mb-6 overflow-hidden">
                                        {fb.imagesFeedback.slice(0, 3).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                className="w-14 h-14 object-cover rounded-sm border border-gray-100"
                                                alt="Feedback"
                                            />
                                        ))}
                                        {fb.imagesFeedback.length > 3 && (
                                            <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                                                +{fb.imagesFeedback.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                        {fb.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {fb.userId?.name || 'Khách hàng'}
                                        </p>
                                        <p className="text-[11px] text-gray-400 uppercase tracking-widest truncate">
                                            {fb.productId?.nameProduct || 'Sản phẩm'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
