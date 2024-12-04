import jwt from 'jsonwebtoken'
import User from "../Models/usermodel.min.js"
import dotenv from 'dotenv'

dotenv.config()
const authToken ={
 verifyToken: async (req, res, next)=> {
 try {
    const token = req.cookies.token
    // console.log("Token from auth", token);
    if (!token) {
        return res.status(400).json({message:"Token is missing"})

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_secret)
        req.userId = decoded.id
        // console.log("userId",req.userId)
        // const findUser = await User.findById(decoded.id)
        //     if(!findUser){
        //         return res.status(404).json({message:"User not found"})
        //     }
        //     res.status(200).json({message:"User found", findUser})
       next() 
    } catch (error) {
        res.status(401).json({message:"Invalid Token"})
    }
    
    
 } catch (error) {
    res.status(500).json("Server Error")
 }   
}
}
export default authToken