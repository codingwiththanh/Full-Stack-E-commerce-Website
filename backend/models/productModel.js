import mongoose from "mongoose";

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Tên sản phẩm

  description: {
    type: String,
    required: true,
  }, // Mô tả sản phẩm

  price: {
    type: Number,
    required: true,
  }, // Giá sản phẩm

  image: {
    type: Array,
    required: true,
  }, // Danh sách URL ảnh sản phẩm (array vì có thể nhiều ảnh)

  category: {
    type: String,
    required: true,
  }, // Danh mục chính (Áo, Quần, Phụ kiện...)

  subCategory: {
    type: String,
    required: true,
  }, // Danh mục con (Áo Thun, Quần Nỉ...)

  sizes: {
    type: Array,
    required: true,
  }, // Các size có sẵn cho sản phẩm (S, M, L, XL,...)

  bestseller: {
    type: Boolean,
  }, // Có phải sản phẩm bán chạy không (tùy chọn)

  date: {
    type: Number,
    required: true,
  }, // Thời điểm tạo sản phẩm (timestamp)
});

// Tạo model, tránh tạo lại nếu đã tồn tại
const productModel =
  mongoose.models.product || mongoose.model("Product", productSchema);

export default productModel;
