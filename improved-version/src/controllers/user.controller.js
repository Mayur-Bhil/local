import User from "../model/user.model.js";
import jwt from "jsonwebtoken"
export const createUserController = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({
            email:email
        })

        if(existingUser){
            return res.json({
                message: "User is already exist"
            })
        }
        const newUser = await User.create({
            name:name,
            email:email,
            password
        })

        await newUser.save();

        res.json({
            message : "User Created SuccessFUlly",
            data:newUser,
            success:true,
            error:false
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Something went wrong"
        })
    }
}


export const signinUser = async(req,res)=>{
     try {
        const {email,password} = req.body;

        if(!email){
            return res.json({
                message :"Enter Email"
            })
        }
        if(!password){
            return res.json({
                message :"Enter Email"
            })
        } 
        const user = await User.findOne({email:email})
        console.log("user",user );

        if(!user){
            return res.josn({
                message : "invalid Credentials"
            })
        }

        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            return res.json({
                message:"Enter Vailid Password",
                success:false,
                error:true                 
            })
        }

        const jwtToken = jwt.sign({
            _id:user._id
        },
            process.env.JWT_SECRET_KEY
        )
    return res.json({   
        message:"signup successFully",
        user:{
            email: email,
            password: password,
            jwt : jwtToken
        },
        success:true,
        error:false
})
        
} catch (error) {
        
        return res.status(500).json({
            error: error.message,
            message: "Something went wrong"
        })
    }
}