import express from "express"
import { jwtVerification } from "../middleware/jwt.js"
import { createOrder,deposites,getWithdrawals,updateWithdraw,verifyPayment, withdraw } from "../controllers/paymentController.js"


const paymentRouter = express.Router();

paymentRouter.post("/order",createOrder)
paymentRouter.post("/verify-payment", jwtVerification,verifyPayment)

paymentRouter.post("/withdraw", jwtVerification, withdraw)
paymentRouter.get("/get-withdrawals", jwtVerification, getWithdrawals)
paymentRouter.patch("/update-withdraw/:id", jwtVerification, updateWithdraw)



export default paymentRouter

