import nodemailer from "nodemailer"
import dotenv from "dotenv";
import userSchema from "../../model/userSchema.js"
import { hashPassword } from "../../utils/hashPassword.js";
dotenv.config()




const transporter = nodemailer.createTransport({
  service :'gmail',
  auth:{
    user:process.env.SEND_OTP_EMAIL,
    pass:process.env.SEND_OTP_PASSWORD 
  }
});

const otpStore = {}

const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;

      
        const otp = Math.floor(Math.random() * 90000 + 9999)

          const mailOptions = {
            from: process.env.SEND_OTP_EMAIL,
            to: email,
            subject: "OTP Verification",
            html:` <p>Hi ${email},</p>
            <p>Thank you for reseting password ! To complete your verification, please use the OTP code below:</p> </br>
            <span class="otp">OTP : <b>${otp}<b/></span> </br>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>  `
        }

          await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(200).json({
        message:`something went wrong`,
        error
      })
    }
             otpStore[email] = otp.toString();
             
          

            res.status(200).json({
      status:true,
              message: `We have successfully send OTP  to ${email}`,
      shortMessage:"OTP sent"
            })
            
            
      
   
    
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
        

        
    } catch (error) {
        res.status(400).json({
            message: "something is wrong in send otp",
            error:error.message
        })
    }
}


const verifyOtp = async (req, res) => {
    const { email, otp, password } = req.body;

  try {
     
    

    if (otpStore[email] === otp) {
          
 
              
          const hashedPassword = await hashPassword(password);
           const updated =  await userSchema.updateOne({email},{$set:{password:hashedPassword}})

            delete otpStore[email]
        
            res.json({
                message: "Password Changed !",
              verification: true,
                updated
            })
            
        } else {
            res.status(400).json({
                message: "Invalid OTP",
                verification:false
                
            })
        }
        
  } catch (error) {
     return  res.send(error.message)
    }
}

export {sendOtp,verifyOtp}