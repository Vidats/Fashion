# Tiêu đề dự án

Website thương hiệu thời trang.

## Công nghệ được sử dụng

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (để tải ảnh lên)

### Frontend
- React.js
- Vite
- Axios

## Hướng dẫn cài đặt

Làm theo các bước sau để thiết lập và chạy dự án cục bộ.

### 1. Sao chép kho lưu trữ (repository)

```bash
git clone <repository-url>
cd doanbackend
```

### 2. Cài đặt Backend

Truy cập thư mục `backend`, cài đặt các phụ thuộc và khởi động máy chủ.

```bash
cd backend
npm install
```

#### Biến môi trường

Tạo một tệp `.env` trong thư mục `backend` với các biến sau:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
```

#### Chạy Backend

```bash
npm start
```

Máy chủ backend sẽ chạy trên `http://localhost:5000` (hoặc cổng được chỉ định trong tệp `.env` của bạn).

### 3. Cài đặt Frontend

Truy cập thư mục `frontend`, cài đặt các phụ thuộc và khởi động máy chủ phát triển.

```bash
cd ../frontend
npm install
```

#### Biến môi trường

Tạo một tệp `.env` trong thư mục `frontend` với các biến sau:

```
VITE_API_URL=http://localhost:5000/api/v1
```

#### Chạy Frontend

```bash
npm run dev
```

Máy chủ phát triển frontend sẽ chạy trên `http://localhost:5173` (hoặc cổng được chỉ định bởi Vite).

## Cấu trúc dự án

- `backend/`: Chứa API Node.js Express.
- `frontend/`: Chứa ứng dụng React.js.

## Điểm cuối API

(Bạn có thể thêm danh sách các điểm cuối API chính tại đây nếu muốn)

## Đóng góp

(Hướng dẫn đóng góp cho dự án)

## Giấy phép

(Thông tin giấy phép)
