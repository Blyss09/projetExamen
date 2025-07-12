import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkUser, requireAuth } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

  app.use(cookieParser());
  app.use(express.json()); // allow to send json data to the server

  //JWT
  app.use(checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.userId)
});

app.use("/api/user/", userRoutes);
app.use("/api/game/", gameRoutes);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB();
    console.log("Server is running on port 5000");
});






