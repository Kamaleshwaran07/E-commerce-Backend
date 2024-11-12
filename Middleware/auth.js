import jwt from 'jsonwebtoken'


const authToken ={
 verifyToken: async (req, res, next)=> {
 try {
    const token = req.cookies.token
    console.log(token);
    if (!token) {
        res.status(400).json({message:"Token is missing"})

    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = decoded.id
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