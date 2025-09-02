import mongoose, { mongo } from "mongoose";

const connectDB = async()=>{
   try {
         const connection = await mongoose.connect(process.env.DB_URI);
         if (connection) {
            console.log(`Db COnnected SucceswFully on port ${process.env.PORT}` );
         }
   } catch (error) {
        console.log(error);

   }
}


export default connectDB;