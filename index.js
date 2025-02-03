import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'



dotenv.config()

const mongoDB = process.env.mongoDBConnectionString;

const port = process.env.Port || 5000


const connectDB = async () => {
    try {
        console.log("Connecting to mongoDB")
        const connection = await mongoose.connect(mongoDB)
        console.log("Connection Successful");
        app.listen(port, () => {
            console.log("App is running in Port =", port);
        })
        return connection;
        

    }
    catch (error) {
        console.log("Error connecting to the database", error.message);
    }
}
connectDB()