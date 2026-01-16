import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Cột 1: Giới thiệu thương hiệu */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter">MyStore</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Chuyên cung cấp các mẫu giày Sneaker chất lượng cao, cập nhật xu hướng mới nhất trên thế
                            giới.
                        </p>
                        <div className="flex gap-4">
                            <Facebook
                                size={20}
                                className="text-gray-400 hover:text-black cursor-pointer transition-colors"
                            />
                            <Instagram
                                size={20}
                                className="text-gray-400 hover:text-black cursor-pointer transition-colors"
                            />
                            <Twitter
                                size={20}
                                className="text-gray-400 hover:text-black cursor-pointer transition-colors"
                            />
                        </div>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div>
                        <h3 className="font-bold uppercase text-xs mb-4">Cửa hàng</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>
                                <Link to="/products" className="hover:text-black transition-colors">
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-black transition-colors">
                                    Bộ sưu tập mới
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-black transition-colors">
                                    Giảm giá
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ khách hàng */}
                    <div>
                        <h3 className="font-bold uppercase text-xs mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>
                                <Link to="/" className="hover:text-black transition-colors">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-black transition-colors">
                                    Hướng dẫn chọn size
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-black transition-colors">
                                    Theo dõi đơn hàng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Thông tin liên hệ */}
                    <div>
                        <h3 className="font-bold uppercase text-xs mb-4">Liên hệ</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="mt-0.5 shrink-0" />
                                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="shrink-0" />
                                <span>090 123 4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="shrink-0" />
                                <span>support@mystore.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Dòng bản quyền */}
                <div className="border-t mt-12 pt-8 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                        © {new Date().getFullYear()} MYSTORE. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
}
