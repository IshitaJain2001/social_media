import { model, Schema } from "mongoose";
import validator from "validator"
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
default : false
    }
    })


   const userModel= model("Users", userSchema)
   export default userModel;

//    gmail -> app password 
