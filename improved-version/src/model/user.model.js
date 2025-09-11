import { Schema,model } from "mongoose";
import bcrypt from "bcrypt"
const UserSchema = new Schema({
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


UserSchema.index({name:1});

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  console.log("passwordv Hash",passwordHash );
  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  console.log("PAssword Is Valid",isPasswordValid );
  return isPasswordValid;
};

UserSchema.pre("save",async function(next) { 
     const user = this;
     // console.log("user", user);
     if(user.isModified('password')) return next;

     try {
          const hashedPAssword = await bcrypt.hash(user.password,10);
          // console.log("hashedpass",hashedPAssword);
          user.password = hashedPAssword
          
          next();
     } catch (error) {
          next();
     }
})

const User = model("User",UserSchema);

export default User ;