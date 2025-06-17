import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderCode: { type: String, required: true, unique: true },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // 👈 Model name chính xác của sản phẩm
                required: true
            },
            size: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    amount: { type: Number, required: true },
    address: {
        ten: String,
        ho: String,
        email: String,
        duongSonha: String,
        phuongXa: String,
        quanHuyen: String,
        thanhPho: String,
        dienThoai: String
    },
    status: { type: String, required: true, default: 'Đã đặt hàng' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
