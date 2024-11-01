import mongoose from "mongoose";
import dotenv from "dotenv";

// Configure dotenv to load environment variables from .env file
dotenv.config();

const DB_URL = process.env.DATABASE_URL;

console.log("Connecting to:", DB_URL);

const databaseConnect = () => {
 mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error:", err));
}

export default databaseConnect;