import mongoose from "mongoose";

export const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required:true
  },  
  winner: {
    type: Number
  },
  roomId: {
    type :String,
  },
  roomPassword: {
    type:String
  },
  entryFee: {
    type: Number,
    required: true
  }, 
  prizePool: {
    type: Number
  },  
  maxTeams: {
    type: Number,
    required: true
  }, 
  startDate: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  map: {
    type: String,
    enum: ['Erangel', 'Miramar', 'Sanhok', 'Vikendi',"TDM", "Livik"],
    required: true
  },
  type: {
    type: String,
    enum: ['Squad', 'Duo', 'Solo'],
    required: true
  },
  isCompleted: {
    type: Boolean,
    enum: ['true', 'false'],
    default: false
  },
  teams: [

     {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
 
    
  ]  // Registered teams

})

export default mongoose.model("tournament",tournamentSchema)