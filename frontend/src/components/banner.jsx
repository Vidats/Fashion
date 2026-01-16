import { useState, useEffect } from 'react';

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'Thời trang mới nhất',
            subtitle: 'Khám phá bộ sưu tập mới của chúng tôi',
            image: 'image/nen2.webp',
            bgColor: 'from-blue-600 to-blue-800',
        },
        {
            id: 2,
            title: 'Giảm giá lên đến 50%',
            subtitle: 'Mua ngay và tiết kiệm lớn',
            image: 'image/nen3.webp',
            bgColor: 'from-purple-600 to-pink-600',
        },
        {
            id: 3,
            title: 'Phụ kiện độc quyền',
            subtitle: 'Thêm phong cách vào bộ trang phục của bạn',
            image: 'image/nenn.webp',
            bgColor: 'from-orange-600 to-red-600',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[450px] overflow-hidden rounded-lg shadow-lg">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* Background Image - Fit container */}
                    <div
                        className="absolute inset-0 bg-cover"
                        style={{
                            backgroundImage: `url('${slide.image}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center top',
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/35" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                        <div className="max-w-2xl">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 drop-shadow-md">
                                {slide.subtitle}
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition transform hover:scale-105">
                                Mua sắm ngay
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 rounded-full transition ${
                            index === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/50 hover:bg-white/75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
