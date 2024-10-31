import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import userSchema from "../model/userSchema.js"
import depositSchema from "../model/depositSchema.js";
import withdrawSchema from "../model/withdrawSchema.js";
dotenv.config();

// razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY, // Add your Razorpay Key ID
  key_secret: process.env.RAZORPAY_SECRET_KEY, // Add your Razorpay Key Secret
});

// create an order
export const createOrder = async (req, res) => {
  const { amount, currency } = req.body;
  const options = {
    amount: Number(amount) * 100, // Convert to smallest currency unit
    currency: currency,
  };

  try {
    const order = await instance.orders.create(options);

    res.status(200).json({
      order,
    });
  } catch (error) {
    res.json({
      message: "Error to create orders in paymentController",
      error: error.message,
      error,
    });
  }
};

// verify payment
export const verifyPayment = async (req, res) => {

  const userId = req.user.userId;

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount } =
      req.body;
    const hash = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY) // Replace with your key_secret
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (hash === razorpay_signature) {
      const updated = await userSchema.updateOne({ _id: userId }, {
        $inc: {
          wallet:Number(amount)
        }
      })
      
      const saveDeposit = new depositSchema({
        balance: amount,
        type: "razorpay",
        orderNumber: razorpay_order_id,
        userId:userId
      })
      
      await saveDeposit.save()

      return res.status(200).json({
          message: "Payment verified successfully!",
          updated
        });
    } else {
      // Payment verification failed
      return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
  }
};

// deposites history

export const deposites = async (req, res) => {
  try {
    const  data  = req.body;
  

    const depositData = new depositSchema(data);
    const deposites = await depositData.save()
    res.status(200).json({
      message: "OK",
      deposites
    })
    
  } catch (error) {
   console.log(error)
  }
  
}

// withdraw 
export const withdraw = async (req,res) => {
  try {
    const id = req.user.userId
    const { amount,upi,type  } = req.body;

    

    const userData = await userSchema.findById({_id:id})
     
    const ref = new withdrawSchema({
      userId: id,
      amount,
      upi,
      name: userData.name,
      email: userData.email,
      type
 
    })

    if(!id) res.send("id is required !")
    if (!userData) res.send("user not found");

    if (userData.wallet < amount) res.send("Infuince balance");

    userData.wallet -= amount
    await userData.save()
    let data = await ref.save()


    res.status(200).json({
      message: "Ok",
      data,
     

    })
  } catch (error) {
    console.log(error)
  }
}

// update withdraw 
export const updateWithdraw = async (req,res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { status } = req.body;
    
    if (!id) res.send("id is required");

    const upatedref = await withdrawSchema.updateOne({ _id: id }, { $set: { status: status } });


    res.status(200).json({
      message: "Ok",
      upatedref,
     

    })
  } catch (error) {
    console.log(error)
  }
}


// get withdrawals

export const getWithdrawals = async (req, res) => {
  try {
    const data = await withdrawSchema.find();
    if (!data) res.send("data is not found");

    res.status(200).json({
      message: "ok",
      data
    })
  } catch (error) {
    console.log(error)
  }
}