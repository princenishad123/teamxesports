import userSchema from "../model/userSchema.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js"
import { generateToken, isAdmin } from "../middleware/jwt.js"
import tournamentSchema from "../model/tournamentSchema.js";

// Sign up user controller
export const signUpController = async (req, res) => {
    const { email } = req.body
    const userData = req.body
    try {
  
        // simple validation
        if(!req.body.name) res.json({message: "Name is Reqiured"})
        if(!req.body.email) res.json({message: "Email is Required"})
        if (!req.body.password) res.json({message: "Password is Reqiured"})
        
        // check email 
        const isEmail = await userSchema.findOne({ email });
        if (isEmail) res.status(400).json({
            message: "Email Already Registred",
            code:false
        })
        
        // hash user password 
        userData.password = await
            hashPassword(userData.password)
        
        
        
        const user = new userSchema(userData);
        const result = await user.save();

        res.status(200).json({
            message: "Sign success login Now",
            result
        })
        
        

        
        
    } catch (error) {
       
    }
    
}

//  Login user controller
export const loginController = async (req, res) => {
    const { email, password } = req.body;
 

    try {

        // simple validation 
      if(!email) res.json({message:"Email is required"})
        if (!password) res.json({message:"password is required"})
        
        // check email register
        const isUser = await userSchema.findOne({ email })
        
        if (!isUser) res.json({message:"Invalid email or password"})
        
        // check password
      
     
        const isMatch = await comparePassword(password, isUser.password)
        if (!isMatch) res.json({ message: "Invalid email or password" })
        
        // create payload
        const payload = {
            userId: isUser.id,
            email:isUser.email
        }

        //generate token
        const token = await generateToken(payload);

       

        res.status(200).json({
            message: "Login success",
            token: token,
            cookie:"Cookie has been send"
            
        })

        
        
    } catch (error) {
    
        res.send(error)
        
    }
    
}


// get all users

export const getUsers = async (req, res) => {
    try {

        const users = await userSchema.find();

        if (!users) res.json({ message: "User not found" });

        res.status(200).json({
            success:"Ok",
            users
        })
        
    } catch (error) {
        res.json({error})
    }
    
    
}

// get user account
export const getUserAccount = async (req, res) => {

    const userId = req.user.userId
  try {
      const userData = await userSchema.findById(userId);
      if (!userData) res.json({ message: "User not Found" });

      const { name,email,wallet,tournaments,isAdmin } = userData;

      res.status(200).json(
          {
    
          name,
          email,
              wallet,
          isAdmin,
              tournaments
          }
      )
  } catch (error) {
    
  }
    
}

//  get all regiseted tournaments by id

export const getRegisteredTournaments = async (req,res) => {
    try {
        const userId = req.user.userId;

        const userData = await userSchema.findById(userId);

        if (!userData) res.json({ message: "user not found" });

        const ids = userData.tournaments.map((e) => e.tounamentid);

        // const ids = ['6717b444924780d11213a6f7']


        const myTournaments = await tournamentSchema.find({ _id: { $in: ids } })
       
        res.json({
             myTournaments
        })

        
    } catch (error) {
        console.log(`error in find regisred tournaments ${error}`)
    }
    
}



