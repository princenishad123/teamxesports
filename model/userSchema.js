import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
       type:String,
        required: true,
        trim:true
    },
  
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
        
    },
    wallet: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    phoneNumber: {
        type: Number
    },

    invite_code: {
        type: String,
        trim:true
    },
    tournaments: [
        
    ]

}, { timestamps: true })

export default mongoose.model("users",userSchema)