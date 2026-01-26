import { useEffect, useState } from 'react';
import { listCategory } from '../config/CategoryRequest';
import { listProduct } from '../config/ProductRequest';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import LatestFeedback from './LatestFeedback';

function HomePage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catRes, prodRes] = await Promise.all([listCategory(), listProduct()]);

                setCategories(catRes.metadata || []);
                setProducts(prodRes.metadata || []);
            } catch (err) {
                console.error('Lỗi tải dữ liệu:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter((prod) => prod.categoryProduct === selectedCategory)
        : products;

    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat._id === categoryId);
        return category ? category.nameCategory : 'Khác';
    };

    if (loading) return <div className="text-center py-20 font-sans">⏳ Đang tải dữ liệu...</div>;
    if (error) return <div className="text-red-500 text-center py-20 font-sans">❌ Lỗi: {error}</div>;

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            {/* --- Danh mục sản phẩm --- */}
            {/* --- Danh mục sản phẩm (Giao diện hình tròn) --- */}
            <div className="max-w-7xl mx-auto pt-24 px-4">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 tracking-tight text-center">
                    Danh mục sản phẩm
                </h2>

                {/* Nút Tất cả */}
                <div className="mb-12 flex justify-center">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-8 py-2 text-xs font-bold uppercase tracking-widest border-2 transition-all duration-300 rounded-full ${
                            selectedCategory === null
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 hover:bg-gray-900 hover:text-white border-gray-300'
                        }`}
                    >
                        Tất cả sản phẩm
                    </button>
                </div>

                {/* Danh sách ô tròn */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div
                                className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-all duration-500 ease-in-out ${
                                    selectedCategory === cat._id
                                        ? 'border-black scale-110 shadow-lg'
                                        : 'border-gray-100 group-hover:border-gray-300'
                                }`}
                            >
                                <img
                                    src={cat.imageCategory}
                                    alt={cat.nameCategory}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Lớp phủ nhẹ khi được chọn hoặc hover */}
                                <div
                                    className={`absolute inset-0 bg-black/5 transition-opacity ${
                                        selectedCategory === cat._id ? 'opacity-0' : 'group-hover:opacity-0'
                                    }`}
                                ></div>
                            </div>

                            <span
                                className={`mt-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${
                                    selectedCategory === cat._id ? 'text-black' : 'text-gray-500 group-hover:text-black'
                                }`}
                            >
                                {cat.nameCategory}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Sản phẩm --- */}
            <div className="bg-gray-50 rounded-t-3xl mt-32">
                <div className="max-w-7xl mx-auto pt-24 pb-16 px-4">
                    <div className="flex flex-col items-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 text-center">
                            {selectedCategory ? 'Sản phẩm' : 'Tất cả sản phẩm'}
                        </h2>
                        <div className="h-1.5 w-24 bg-gray-900"></div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">Không có sản phẩm trong danh mục này.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-20">
                                {filteredProducts.map((prod) => (
                                    <div
                                        key={prod._id}
                                        className="group flex flex-col transition-transform duration-300 hover:-translate-y-2"
                                    >
                                        <Link to={`/product/${prod._id}`} className="block overflow-hidden rounded-lg">
                                            <div className="relative bg-white border border-gray-200 rounded-lg aspect-[4/5] overflow-hidden group-hover:shadow-xl">
                                                <img
                                                    src={prod.imagesProduct?.[0] || 'https://via.placeholder.com/400'}
                                                    alt={prod.nameProduct}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase text-gray-800">
                                                    {getCategoryName(prod.categoryProduct)}
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="mt-4 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                <Link to={`/product/${prod._id}`} className="hover:underline">
                                                    {prod.nameProduct}
                                                </Link>
                                            </h3>
                                            <div className="flex justify-between items-center mt-auto">
                                                <span className="text-xl font-black text-black">
                                                    {Number(prod.priceProduct).toLocaleString()}đ
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button className="border border-gray-300 rounded-full p-2 hover:bg-black hover:text-white transition-all">
                                                        <Heart size={18} />
                                                    </button>
                                                    <button className="border border-gray-400 rounded-full p-2 hover:bg-black hover:text-white transition-all">
                                                        <ShoppingCart size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-24 text-center">
                                <Link
                                    to="/products"
                                    className="inline-block bg-white border-2 border-gray-900 text-gray-900 font-bold px-10 py-4 rounded-md hover:bg-gray-900 hover:text-white transition-all"
                                >
                                    Xem tất cả
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <LatestFeedback />
        </div>
    );
}

export default HomePage;
