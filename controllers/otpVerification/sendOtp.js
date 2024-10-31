import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service :'gmail',
  auth:{
    user:"coddies.ai@gmail.com",
    pass:"jbxerovatkvgusmg"
  }
});

const otpStore = {}

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(Math.random() * 9000 + 999)

          const mailOptions = {
            from: "coddeis.ai@gmail.com",
            to: email,
            subject: "OTP Verification",
            text:`Hii Welcome to zomato india's No.1 food delivery platfrom your OTP is ${otp} `
        }

          await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).json({
        message:`something went wrong`,
        error
      })
    }
             otpStore[email] = otp.toString();
             
             console.log(`${otpStore} make remove it clg se`)

    res.status(200).json({
      message:`OTP has sended to ${email}`,
    })
      
   
    // console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
        

        
    } catch (error) {
        res.status(400).json({
            message: "something is wrong in send otp",
            error:error.message
        })
    }
}


const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    try {
        if (otpStore[email] === otp) {

            delete otpStore[email]
            console.log(otpStore)
            res.json({
                message: "verification success",
                verification:true
            })
            
        } else {
            res.status(400).json({
                message: "Invalid OTP",
                verification:false
                
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

export {sendOtp,verifyOtp}