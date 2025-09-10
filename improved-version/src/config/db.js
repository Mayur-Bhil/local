import mongoose from "mongoose";

async function connectDB(){
    await mongoose.connect(process.env.DB_URI);
}





export default connectDB;

