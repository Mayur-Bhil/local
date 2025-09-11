import { Router } from "express";
import { createUserController, signinUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup",createUserController);
userRouter.post("/signin",signinUser)




export default userRouter;