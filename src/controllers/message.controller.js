import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose"; // for ObjectId validation

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const contacts = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json({ message: "Contacts fetched successfully", contacts });
    } catch (error) {
        console.log("Error in getAllContacts controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const loggedInUser = req.user._id;
        // Validate receiverId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid receiver ID" });
        }
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser, receiverId },
                { senderId: receiverId, receiverId: loggedInUser }
            ]
        }).populate("senderId", "fullName").populate("receiverId", "fullName");
        res.status(200).json({ message: "Messages fetched successfully", messages });
    } catch (error) {
        console.log("Error in getMessages controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { receiverId } = req.params;
        const loggedInUser = req.user._id;

        // if the user sends a image as the message
        let imageUrl;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId: loggedInUser,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        return res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        console.log("Error in sendMessage controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser },
                { receiverId: loggedInUser }
            ]
        }).populate("senderId", "fullName").populate("receiverId", "fullName");

        const chatPartners = messages.map(message => {
            if (message.senderId._id.toString() === loggedInUser.toString()) {
                return message.receiverId;
            } else {
                return message.senderId;
            }
        });

        res.status(200).json({ message: "Chat partners fetched successfully", chatPartners });
    } catch (error) {
        console.log("Error in getChatPartners controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
