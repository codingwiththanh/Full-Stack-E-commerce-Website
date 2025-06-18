import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("Đã kết nối với MongoDB");
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/freestyle-ec`)

}

export default connectDB;