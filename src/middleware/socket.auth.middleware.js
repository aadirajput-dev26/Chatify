import jwt from "jsonwebtoken"
import User from "../models/User.js"
import dotenv from "dotenv"
dotenv.config();

export const socketAuthMiddleware = async (socket, next) => {
    try{
        // extract the token from the http-only cookie
        const token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

        // if token is not present
        if(!token) {
            console.log("Socket connection failed: No token provided");
            return next(new Error("Unauthorised : No token provided"));
        }

        // if the token is present, we need to verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken) {
            console.log("Socket connection failed: Invalid token provided");
            return next(new Error("Unauthorised : Invalid token provided"));
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        // check if the user exists
        if (!user) {
            console.log("Socket connection rejeted: User not found");
            return next(new Error("User not found"));
        }

        // attach user info to socket 
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated for user: ${user.fullName} (userID : ${user._id})`);

        next();
    } catch (error) {
        console.log("Error in socketAuthMiddleware", error);
        next(new Error("Unauthorised : Invalid token provided"));
    }
}