import { Router } from "express";
import { login, register, verifyOtp, updateProfile, getProfile, searchFriends, addFriend, removeFriend, getFriends } from "../controllers/userController.js";

const userRouter = Router()

userRouter.post("/register", register)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/login", login)
userRouter.post("/update-profile", updateProfile)
userRouter.get("/profile/:userId", getProfile)
userRouter.get("/search-friends", searchFriends)
userRouter.post("/add-friend", addFriend)
userRouter.post("/remove-friend", removeFriend)
userRouter.get("/friends/:userId", getFriends)

export default userRouter