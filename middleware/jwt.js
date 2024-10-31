import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import userSchema from "../model/userSchema.js"
dotenv.config()

// user varification
const jwtVerification = (req, res, next) => {
    try {
        const decoded =  jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
        req.user = decoded
        if (!decoded) return res.status(500).send({ message: "Please Login to access this ." })
        next()

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status:400,
            message: "invalid Token",
            error
        })
    }
    
}

// admin verification

const isAdmin = async (req,res,next) => {
    try {
        const userId = req.user.id;
        if (!userId) res.status(400).json({ message: "Id must be have" });

        const admin = await userSchema.findById({ userId });
       
        if (admin.isAdmin) {
            next()
        } else {
            res.status(400).json({
                message: "You are not admin ",
                access:"access Denied"
            })
        }
            
        
    } catch (error) {
        res.status(400).json({
            message: "You can't access this.",
            error:error.message
        })
    }
    
}

// generaate JWT 
const generateToken = async (userData) => {
   return await jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
}

export {jwtVerification, generateToken,isAdmin}