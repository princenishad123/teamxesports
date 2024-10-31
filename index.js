import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import databaseConnect from "./database/database.js";


// import all router here
import router from "./routes/auth.js"; 
import matchRouter from "./routes/match.js";
import paymentRouter from "./routes/payment.js";

dotenv.config()
const app = express();

// connect database here
databaseConnect()




const port = process.env.PORT || 8080;


// app configrations
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


// routes
app.use("/user", router)
app.use("/matches", matchRouter)
app.use("/user",paymentRouter)

 

app.listen(port,()=>console.log(`server running on ${port}`))