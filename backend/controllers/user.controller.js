import User from '../models/users.model.js';
import mongoose from "mongoose";



export const getUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}



export const createUser = async (req, res) => {
    const user = req.body; // user will send this data to the server

    if (!user.pseudo || !user.email || !user.password) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error creating user", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const updateUser = async (req, res) =>{
    const { id } = req.params;

    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "User not found" }); // if the id is not valid, return 404
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        res.status(200).json({ success: true, data: updatedUser });                     // if the id is valid, update the user
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}



export const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });      // if the id is valid, delete the user
    } catch (error) {
        res.status(404).json({ success: false, message: "User not found" });              // if the id is not valid, return 404 
    }
}