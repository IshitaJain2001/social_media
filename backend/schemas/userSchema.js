import { model, Schema } from "mongoose";

  const userSchema= new Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
type:String
    },
    userName:{
type: String,
required: true,
unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    email :{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    otp:{
type: String
    },
    otpExpires:{
type: Date
    },
    isVerified:{
      type: Boolean,
      default: false
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500
    },
    profilePicture: {
      type: String,
      default: null
    },
    friends: [{
      type: String,
      default: null
    }]
    })


   const userModel = model("Users", userSchema)
   export default userModel
