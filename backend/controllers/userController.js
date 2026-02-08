 import bcrypt from "bcrypt"
  import otpgenerator from "otp-generator"
 import userModel from "../schemas/userSchema.js"
 import { sendOTP } from "../services/otpservice"


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
 otpExpires: new Date(Date.now()+ 10*60*1000), isVerified: false
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

