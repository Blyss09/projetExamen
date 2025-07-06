import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.route.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));


app.use(express.json()); // allow to send json data to the server

app.use("/api/user/", userRoutes);
app.use("/api/game/", gameRoutes);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB();
    console.log("Server is running on port 5000");
});






