 import bcrypt from "bcrypt"
  import otpgenerator from "otp-generator"
 import userModel from "../schemas/userSchema.js"
 import { sendOTP } from "../services/otpservice"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export  async function register(req,res){
const {email,password,userName,lastName,firstName} = req.body

if(!email || !password || !firstName || !userName){
    return res.status(400).json({
        message:"incomplete information, please fill in all details "
    })
}

 //exists

 let alreadyExists= await userModel.findOne({
    $or:[{email}, {userName}]
 })


  if(alreadyExists){
    return res.status(400).json({
        message:"your email is already in use!!"
    })
  }

 
try {
     const hashedPassword= await bcrypt.hash(password,10)

const otp=  otpgenerator.generate(6, {
  lowerCaseAlphabets: false, 
  upperCaseAlphabets: false, 
  specialChars: false     
})

const user=  new userModel({
 email,password:hashedPassword,userName,lastName,firstName, otp,    
 otpExpires: new Date(Date.now()+ 2*60*1000), isVerified: false
})
const isOTPsent= await sendOTP(email,otp)

if(!isOTPsent){
    return res.status(500).json({
        message:"otp sent failed",
     id:   user._id,email: user.email
    })
}

 return res.status(201).json({
     message:"otp sent successfully ",
     userId: user._id,
     email: user.email
  })
 } catch (error) {
   return res.status(400).json({
     message: error
   })  
 }
 
 }






export async function verifyOtp(req,res){
try {
  const {userId, otp} = req.body

  if(!userId || !otp){
    return res.status(400).json({
      message:"either otp is missing or userid "
    })
  }

  const user= await userModel.findById(userId)

if(!user){
  return res.status(400).json({
    message:"user not found"
  })
}
if(new Date()> user.otpExpires ){
return res.status(400).json({
  message:"otp expired"
})
}
if(otp== user.otp){
  user.isVerified= true
  user.otp= null
  user.otpExpires= null
  await user.save()
 

 const token=  jwt.sign(
    {userId: user._id, userName: user.userName, email : user.email},
process.env.SECRET_KEY, {expiresIn:"7d"}
   )
  return res.status(200).cookie(token,"token" ).json({
    message:"otp verified successfully !!",
  
    userName:user.userName
  })
}
else{
  return res.status(400).json({
    message:"otp incorrect"
  })
}
} catch (error) {
  return res.status(500).json({
    message:"we are currently exp any issue "
  })
}
 }

 export async function login(req,res){
    let {userName,password} = req.body
    if(!userName || !password){
      return res.status(400).json({
        message:"username or password is missing "
      })
    }

    let user= await userModel.findOne({userName:userName})


    if(!user){
      return res.status(400).json({
        message:"user not found"
      })    }

   const isVerified=    bcrypt.compare(password, user.password)

   if(!isVerified){
    return res.status(400).json({
      message: "invalid credentials "
    })
   }
  }