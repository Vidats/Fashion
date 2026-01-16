import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listProduct } from '../config/ProductRequest';
import { ShoppingCart } from 'lucide-react';
import { requestAddToCart } from '../config/CartRequest';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await listProduct();
                const found = res.metadata.find((p) => p._id === id);
                setProduct(found);
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // ✅ Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = async () => {
        try {
            const data = {
                productId: product._id,
                quantity: 1, // Bạn có thể thêm state số lượng nếu có input chọn số lượng
            };

            const res = await requestAddToCart(data);

            if (res.statusCode === 200 || res.statusCode === 201) {
                alert('Thêm vào giỏ hàng thành công! 🎉');
                // ✅ Bắn sự kiện để Header cập nhật lại số lượng badge
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            console.error('Lỗi thêm giỏ hàng:', error);
            // Nếu lỗi 401 hoặc chưa đăng nhập thì đẩy về trang login
            alert('Vui lòng đăng nhập để thực hiện chức năng này');
            navigate('/auth');
        }
    };

    if (loading) return <div className="text-center py-20">⏳ Đang tải...</div>;

    if (!product) return <div className="text-center py-20 text-red-500">❌ Không tìm thấy sản phẩm</div>;

    return (
        <div className="max-w-6xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Ảnh */}
            <div className="bg-[#f3f3f3] aspect-[4/5] overflow-hidden">
                <img src={product.imagesProduct[0]} alt={product.nameProduct} className="w-full h-full object-cover" />
            </div>

            {/* Thông tin */}
            <div>
                <h1 className="text-3xl font-black uppercase mb-4">{product.nameProduct}</h1>
                <p className="text-xl font-bold mb-4">{Number(product.priceProduct).toLocaleString()}đ</p>
                <p className="text-gray-600 mb-6">{product.descriptionProduct}</p>

                <div className="mb-4">
                    <p>
                        <strong>Màu:</strong> {product.metadata.color}
                    </p>
                    <p>
                        <strong>Size:</strong> {product.metadata.size}
                    </p>
                </div>

                <p className="mb-6">
                    <strong>Tồn kho:</strong> {product.stockProduct}
                </p>

                {/* ✅ Gán sự kiện onClick vào đây */}
                <button
                    onClick={handleAddToCart}
                    className="bg-black text-white px-8 py-4 uppercase font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95"
                >
                    <ShoppingCart size={18} />
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
}

export default ProductDetail;
