import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkUser, requireAuth } from "./middleware/auth.middleware.js";
import http from "http";
import { initShifumiSocket } from "./controllers/shifumi.controller.js";

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
    res.status(200).send(req.user._id)
});

app.use("/api/user/", userRoutes);
app.use("/api/game/", gameRoutes);

console.log(process.env.MONGO_URI);

// Création du serveur HTTP pour socket.io
const server = http.createServer(app);

// Initialisation de socket.io
import { Server as SocketIOServer } from "socket.io";
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Initialisation de la logique socket.io pour le jeu Shifumi
initShifumiSocket(io);

// Démarrage du serveur
server.listen(5000, () => {
    connectDB();
    console.log("Server socket.io en écoute sur le port 5000");
});






