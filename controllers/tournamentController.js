import tournamentSchema from "../model/tournamentSchema.js";
import userSchema from "../model/userSchema.js";

// get tournaments

export const getTournaments = async (req,res) => {
    try {
        const tournaments = await tournamentSchema.find();
        if (!tournaments) res.json({ message: "tournaments not found" });

        res.status(200).json({
            success: "Ok",
            tournaments
        })

        
    } catch (error) {
        res.json({
            message: "failed to fetch tournaments",
            error
       })
    }
}
// get tournaments by ID

export const getTournamentsById = async (req,res) => {
    try {
        const { id } = req.params
     
        const tournaments = await tournamentSchema.findById({_id:id});
        if (!tournaments) res.json({ message: "tournaments not found" });

        // let a = tournaments.map((e) => e.teams);
        


        res.status(200).json({
            success: "Ok",
            tournaments
        })

        
    } catch (error) {
        res.json({
            message: "failed to fetch tournaments",
            error
       })
    }
}


// set room id and poassword 
export const updateRoomPassword = async (req, res) => {
    try {
        const { roomId, roomPassword } = req.body;
        const {id} = req.params

        if (!roomId || !roomPassword) res.json({ message: "all field Required" })
        if (!id) res.json({ message: 'Id not found' })
        
        const tournament = await tournamentSchema.updateOne(
            { _id: id },
            {
                $set: {
                    roomId: roomId,
                    roomPassword:roomPassword
                }
            })
        
        if (!tournament) res.json({ message: "tournament not found" })
        
        res.status(200).json({
            message: "ok",
            tournament
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const getTournamentsDetailsById = async (req,res) => {
    try {
        const { id } = req.params
     
        const tournaments = await tournamentSchema.findById({_id:id});
        if (!tournaments) res.json({ message: "tournaments not found" });

        const a = tournaments.teams.map((e) => e)
        
        const users = await userSchema.find({ _id: { $in: a } })
        



        res.status(200).json({
            success: "Ok",
            tournaments,
            users
        })

        
    } catch (error) {
        res.json({
            message: "failed to fetch tournaments",
            error
       })
    }
}
// get live tournaments 

export const getCpmpletedTournaments= async (req,res) => {
    try {
 
    
     
        const tournaments = await tournamentSchema.find({isCompleted:false});
        if (!tournaments) res.json({ message: "tournaments not found" });

        res.status(200).json({
            success: "Ok",
            tournaments
        })

        
    } catch (error) {
        res.json({
            message: "failed to fetch tournaments",
            error
       })
    }
}
export const getLiveTournaments= async (req,res) => {
    try {
 
    
     
        const tournaments = await tournamentSchema.find({isCompleted:true});
        if (!tournaments) res.json({ message: "tournaments not found" });

        res.status(200).json({
            success: "Ok",
            tournaments
        })

        
    } catch (error) {
        res.json({
            message: "failed to fetch tournaments",
            error
       })
    }
}

// create tournament controllers
export const tournamentController = async (req, res) => {
    const { name, entryFee, maxTeams, startDate, endDate, map, isCompleted, } = req.body;
    const userId  = req.user.userId
    try {
        // validations
        const tournamentRef = new tournamentSchema({...req.body, organizer:userId});

        const result = tournamentRef.save()
        res.json({
            message: "tournament saved",
            response:result
        })
    
    } catch (error) {
        console.log(error)
    }
}

// register team in tournament controller

export const registerTeam = async (req, res) => {
    const userId = req.user.userId
    const { tounamentid } = req.params;

    try {
        const tournament = await tournamentSchema.findById(tounamentid);
        const user = await userSchema.findById(userId)
      
        if (user.wallet < tournament.entryFee) {
            return res.json({
                message:"influences Blanace"
            })
        } 

   

        if (tournament.maxTeams < tournament.teams.length+1) {
            return res.json({ message: "Tournament is Fulled" })
        }
        
        if (tournament.teams.includes(userId)) {
            return res.json({ message: "Your are Already Registred" })
        }

        tournament.teams.push(userId)

        
       
        await userSchema.updateOne({ _id: userId },
            {
                $set: {
                    wallet: user.wallet - tournament.entryFee,
                },
                $push: {
                    tournaments: {
                       tounamentid:tournament._id
                   }
               }

            })
        
        const result = await tournament.save()
    
      

        res.status(200).json({
            message: "Registration success",
            code:200,
            contest:result
        })



        
    } catch (error) {
        console.log(`error in register team ${error}`)
    }
}




