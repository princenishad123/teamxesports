import express from 'express'
import { isAdmin, jwtVerification } from '../middleware/jwt.js';

import { signUpController,loginController, getUserAccount,getRegisteredTournaments, getUsers } from '../controllers/account.js';
const router = express.Router();

// register user routes
router.post("/sign-up", signUpController)

// Login user routes
router.post("/login", loginController)

router.get('/get-allusers',jwtVerification,getUsers)

// get user routes
router.get("/account/:id", jwtVerification, getUserAccount)


// get Registered Tournaments
router.get("/my-contests", jwtVerification, getRegisteredTournaments)


export default router