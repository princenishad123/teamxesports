import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
  
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
  
    orderNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Success", "Failed"],
        default:"Success"
    },
     
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true
        
    }
});

export default mongoose.model("deposites",depositSchema)