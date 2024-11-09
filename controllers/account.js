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
        if(!req.body.name) return res.json({message: "Name is Reqiured"})
        if(!req.body.email) return res.json({message: "Email is Required"})
        if (!req.body.password) return res.json({message: "Password is Reqiured"})
        
        // check email 
        const isEmail = await userSchema.findOne({ email });
        if (isEmail) return res.status(400).json({
            message: "Email Already Registred",
            code:false
        })
        
        // hash user password 
        userData.password = await
            hashPassword(userData.password)
        
        
        
        const user = new userSchema(userData);
        const result = await user.save();

       return res.status(200).json({
            message: "Sign success login Now",
            result
        })
        
        

        
        
    } catch (error) {
       res.send(error)
    }
    
}

//  Login user controller
export const loginController = async (req, res) => {
  
    const { email, password } = req.body;
    try {
        // Simple validation
        if (!email) return res.json({ message: "Email is required" });
        if (!password) return res.json({ message: "Password is required" });
        
        // Check if the email is registered
        const isUser = await userSchema.findOne({ email });
        
        if (!isUser) return res.json({ message: "Invalid email or password" });
        
        // Check password
        const isMatch = await comparePassword(password, isUser.password);
        if (!isMatch) return res.json({ message: "Invalid email or password" });
        
        // Create payload
        const payload = {
            userId: isUser.id,
            email: isUser.email
        };

        // Generate token
        const token = await generateToken(payload);

        return res.status(200).json({
            message: "Login successful",
            token: token,
            userId: isUser.id,  
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};




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

// update user data

export const updateUser = async (req,res) => {
    try {
        const { id, email, name, wallet } = req.body
        
        const user = await userSchema.updateOne({ _id: id }, {
            $set: {
                email,
                name,
                wallet
            }
        });

        if (!user) return res.status(200).json({
            message: "user not found"
        });

        return res.status(200).json({
            message: "updated",
            status:"ok"
        })


        
    } catch (error) {
        return res.json({
            message: "server error",
            error

        })
    }
}


// delete User data

export const deleteUser = async (req, res) => {
      const { _id } = req.body
    try {
      
      
        if (!_id) return res.json({ message: "Id required" })
        
        const del = await userSchema.findByIdAndDelete({ _id });

       return res.status(200).json({
            message: "user deleted",
            del
      })
        
    } catch (error) {
          return res.json({
            message: "server error",
            error

        })
    }
}

// get user account
export const getUserAccount = async (req, res) => {

    const { id } = req.params;
  try {
      const userData = await userSchema.findById(id);
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



