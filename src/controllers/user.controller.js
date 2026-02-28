import User from "../models/User.js";
import cloudinary from "../../lib/cloudinary.js";
import mongoose from "mongoose";

export const updateProfilePicture = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile picture is required" });

        const userId = req.params.id;
        // Validate that the id is a proper MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // check if the user is authorized to update the profile picture
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: cannot modify other user's profile" });
        }

        // check if the user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        // Upload to Cloudinary – catch any upload errors
        let uploadedPic;
        try {
            uploadedPic = await cloudinary.uploader.upload(profilePic);
        } catch (uploadErr) {
            console.error('Cloudinary upload error', uploadErr);
            return res.status(500).json({ message: "Failed to upload image" });
        }

        // update the profile picture
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadedPic.secure_url
        }, { new: true , select : "-password" });

        res.status(200).json({ message: "Profile picture updated successfully", updatedUser });
    } catch (error) {
        console.log("Error in updateProfilePicture controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}