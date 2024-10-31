import mongoose from "mongoose";
const DB_URL = "mongodb://127.0.0.1:27017/teamxesports"
const databaseConnect = () => {
    mongoose.connect(DB_URL, {
         useNewUrlParser: true, 
        useUnifiedTopology: true 
    }).then((res)=>console.log("database connected")).catch((err)=>console.log(err.message))
}

export default databaseConnect;