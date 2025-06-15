import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(express.json()); // allow to send json data to the server

app.use("/api/user", userRoutes);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB();
    console.log("Server is running on port 5000");
});



