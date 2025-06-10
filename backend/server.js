import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import UserModel from "./models/users.model.js";
dotenv.config();

const app = express();

app.use(express.json()); // allow to send json data to the server

app.post("/api/register", async (req, res) => {
    const user = req.body; // user will send this data to the server

    if (!user.pseudo || !user.email || !user.password) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newUser = new UserModel(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error creating user", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB();
    console.log("Server is running on port 5000");
});



