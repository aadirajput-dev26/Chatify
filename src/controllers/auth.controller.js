import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // check if all the fields required are present
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if the password length is more than 8
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        // check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // check if the user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Username already exists" });

        // save the password in the hashed manner
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // generateToken(newUser._id, res);
            // await newUser.save();

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                message: "User created successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            });

            try {
                await sendWelcomeEmail(savedUser.fullName, savedUser.email);
            } catch (error) {
                console.log("Error sending welcome email", error);
            }
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if all the fields required are present
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // check if the user exists in the DB
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        
        // check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        
        // generate token if both are correct 
        generateToken(user._id, res);

        res.status(200).json({
            message: "User logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = async (_, res) => {
    // the request body will be empty, we just need to reduce the age of the token
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const check = async (req, res) => {
    try {
        res.status(200).json({message : "User is Authenticated", user : req.user});
    } catch (error) {
        console.log("Error in check controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}