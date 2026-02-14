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
        typr:String,
        required: true,
        validate : (val)=>{
            return validator.isStrongPassword(val)
        },
        minlength:8,
        maxlength: 15
},
    email :{
        type: String,
        required: true,
        validate: (text)=>{
    return validator.isEmail(text)
        }
    },
    otp:{
type: String
    },
    otpExpires:{
type: Date
    },
    isVerified:{
type: boolean,
default : false
    }
    })


   const userModel= model("Users", userSchema)
   export default userModel;

//    gmail -> app password 
