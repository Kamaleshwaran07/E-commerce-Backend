import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authToken = {
  verifyToken: async (req, res, next) => {
    try {
      // Check both cookie and Authorization header
      const token =
        req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "Token is missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_secret);
      req.userId = decoded.id;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      res.status(500).json({ message: "Server Error" });
    }
  },
};
export default authToken;
