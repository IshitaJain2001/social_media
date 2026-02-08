 //nodemailer

 import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

 const tranportService=  nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.GMAIL_USER,
        pass:process.env.GMAIL_APP_PASSWORD
    }
  })


 export async function sendOTP(email, otp){
try {
    const mailOptions= {
        from : process.env.GMAIL_USER,
        to:email,
        subject :"EMAIL VERIFICATION",
        html : `
        <div>
        <p> The OTP to register is-: ${otp}</p>
        <p> If you haven't asked for otp , kindly ignore this mail.</p>
        </div>
        `
    }

    await tranportService.sendMail(mailOptions)

    return {success: true, message:"otp sent"}
} catch (error) {
   return {success:false, message:"otp failed !"} 
}
 } 


 export async function verifyTransport(){
try{
    await tranportService.verify()
    console.log("transport verified");
    
}
catch(e){
    console.log("tranport verification failed", e);
    
}
 }

 //otp verify nhi krega , nodemailer gmail app password 