import express from 'express'
import { isAdmin, jwtVerification } from '../middleware/jwt.js';

import { signUpController,loginController, getUserAccount,getRegisteredTournaments, getUsers, updateUser, deleteUser } from '../controllers/account.js';
import { sendOtp, verifyOtp } from '../controllers/otpVerification/sendOtp.js';
const router = express.Router();

// register user routes
router.post("/sign-up", signUpController)

// Login user routes
router.post("/login", loginController)

router.get('/get-allusers',jwtVerification,getUsers)

// get user routes
router.get("/account/:id", jwtVerification, getUserAccount)

router.patch("/update-user",jwtVerification,updateUser)
router.delete("/delete-user",jwtVerification,deleteUser)


// get Registered Tournaments
router.get("/my-contests", jwtVerification, getRegisteredTournaments)

// forget password and chenge password

router.post('/send-otp',sendOtp)
router.patch('/verify',verifyOtp)


export default router