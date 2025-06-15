import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Hàm sinh mã đơn hàng duy nhất
const generateOrderCode = () => {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            orderCode: generateOrderCode()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Đã đặt hàng" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing orders using Stripe Method
// const placeOrderStripe = async (req, res) => {
//     try {
//         const { userId, items, amount, address } = req.body
//         const { origin } = req.headers;

//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod: "Stripe",
//             payment: false,
//             date: Date.now(),
//             orderCode: generateOrderCode()
//         }

//         const newOrder = new orderModel(orderData)
//         await newOrder.save()

//         const line_items = items.map((item) => ({
//             price_data: {
//                 currency: currency,
//                 product_data: { name: item.name },
//                 unit_amount: item.price * 100
//             },
//             quantity: item.quantity
//         }))

//         line_items.push({
//             price_data: {
//                 currency: currency,
//                 product_data: { name: 'Delivery Charges' },
//                 unit_amount: deliveryCharge * 100
//             },
//             quantity: 1
//         })

//         const session = await stripe.checkout.sessions.create({
//             success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//             line_items,
//             mode: 'payment',
//         })

//         res.json({ success: true, session_url: session.url });
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// Verify Stripe 
// const verifyStripe = async (req, res) => {
//     const { orderId, success, userId } = req.body
//     try {
//         if (success === "true") {
//             await orderModel.findByIdAndUpdate(orderId, { payment: true });
//             await userModel.findByIdAndUpdate(userId, { cartData: {} })
//             res.json({ success: true });
//         } else {
//             await orderModel.findByIdAndDelete(orderId)
//             res.json({ success: false })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update order status from Admin Panel
// update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Bạn nên kiểm tra danh sách status hợp lệ nếu cần
        const allowedStatuses = [
            "Đã đặt hàng",
            "Chờ đóng gói",
            "Đã gửi hàng",
            "Đang giao hàng",
            "Đã giao hàng",
            "Đã huỷ"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Đã cập nhật trạng thái' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
  

// delete order from Admin Panel
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body
        await orderModel.findByIdAndDelete(orderId)
        res.json({ success: true, message: 'Order Deleted' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// update order info from Admin Panel
const updateOrderAddress = async (req, res) => {
    try {
        const { orderId, newAddress } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { address: newAddress });
        res.json({ success: true, message: 'Cập nhật địa chỉ thành công' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
  
const cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (!["Đã đặt hàng", "Chờ đóng gói"].includes(order.status)) {
            return res.status(400).json({ success: false, message: "Không thể huỷ đơn hàng ở trạng thái này" });
        }

        order.status = "Đã huỷ";
        await order.save();
        res.json({ success: true, message: "Đơn hàng đã được huỷ" });
    } catch (err) {
        console.error("Huỷ đơn thất bại:", err);
        res.status(500).json({ success: false, message: err.message });
    }
  };

export {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus,
    deleteOrder,
    updateOrderAddress,
    cancelOrder,
}
