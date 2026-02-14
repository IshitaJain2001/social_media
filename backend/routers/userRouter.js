import { Router } from "express";
import { login, register, verifyOtp} from "../controllers/userController.js";

const userRouter = Router()

userRouter.post("/register", register)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/login", login)

export default userRouter