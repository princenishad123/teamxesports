import mongoose from "mongoose";
const withdrawSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true
    },
    name: {
        type:String
    },
    email: {
        type: String,
        default:"Razorpay"
    },
    amount: {
        type: Number,
        required:true
    },
   upi: {
       type: String,
       required: true,
       trim:true
    },
    status: {
        type: String,
        enum: ["Processing", "Rejected", "Failed", "Success"],
        default:"Processing"
   },
    createdAt: {
        type: Date,
        default:Date.now()
    },
  

})

export default mongoose.model("withdraw",withdrawSchema)