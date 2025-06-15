import express from 'express'
import {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus,
    deleteOrder,
    updateOrderAddress,
    cancelOrder  
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import {authUser} from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/delete', adminAuth, deleteOrder) 
orderRouter.post('/update-address', adminAuth, updateOrderAddress)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)

// User Feature 
orderRouter.post('/userorders', authUser, userOrders)

// verify payment

orderRouter.put("/cancel/:id", authUser, cancelOrder);


export default orderRouter
