import express from "express";
import cors from 'cors';
import userrouter from "./Routes/userrouter.js";
import morgan from 'morgan'
import cookieParser from "cookie-parser";

const app = express()


app.use(cors());

app.use(express.json())

app.use(morgan("dev"))  

app.use(cookieParser())
const home = (req, res)=>{
    try {
        
        res.status(200).json({message:"Hello this is the homepage"})
    } catch (error) {
        res.status(500).json({message: error.response.data.message})
    }
} 
app.get('/', home)
app.use('/api', userrouter)


export default app;