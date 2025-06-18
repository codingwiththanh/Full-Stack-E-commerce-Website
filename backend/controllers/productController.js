import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

//  Thêm sản phẩm mới (kèm upload ảnh lên Cloudinary)
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Lấy các file ảnh đã upload (tối đa 4 ảnh)
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    // Tải ảnh lên Cloudinary và lấy URL
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//  Thông báo cấu hình cloudinary (để kiểm tra có kết nối đúng không)
console.log("Đã kết nối:", cloudinary.config());

// Lấy toàn bộ danh sách sản phẩm
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Xoá sản phẩm theo ID
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm (từ form admin)
const updateProduct = async (req, res) => {
  try {
    const { productId, updatedData } = req.body;

    if (!productId || !updatedData) {
      return res.json({ success: false, message: "Thiếu dữ liệu" });
    }

    await productModel.findByIdAndUpdate(productId, updatedData);
    res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    res.json({ success: false, message: "Lỗi máy chủ" });
  }
};

//  Lấy chi tiết sản phẩm theo ID
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  updateProduct,
  singleProduct,
};
