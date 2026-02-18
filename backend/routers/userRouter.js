import { Router } from "express";
import { login, register, verifyOtp, updateProfile, getProfile } from "../controllers/userController.js";

const userRouter = Router()

userRouter.post("/register", register)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/login", login)
userRouter.post("/update-profile", updateProfile)
userRouter.get("/profile/:userId", getProfile)

export default userRouter