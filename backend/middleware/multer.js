import multer from "multer";

// Cấu hình nơi lưu trữ file khi upload (tạm thời trong thư mục mặc định)
const storage = multer.diskStorage({
  // Thiết lập tên file khi lưu
  filename: function (req, file, callback) {
    // Giữ nguyên tên gốc của file khi lưu
    callback(null, file.originalname);
  },
});

// Tạo middleware upload sử dụng cấu hình storage ở trên
const upload = multer({ storage });

export default upload;
