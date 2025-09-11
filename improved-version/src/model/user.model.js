import { Schema,model } from "mongoose";

const UserSchema = new Schema({
   userId:{
     type:Number
   },
   name:{
    type:String,
    required:[true,"name is required"]
   },
   email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
   },
   password:{
        type:String,
        required:true,
        minlength: [6, "Password must be at least 6 characters long"],
   }

})

const User = model("User",UserSchema);

export default User ;