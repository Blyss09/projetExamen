import express from "express";
import gameController from "../controllers/game.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Créer une nouvelle partie
router.post("/", requireAuth, (req, res) => gameController.createGame(req, res));

// Rejoindre une partie
router.post("/:gameId/join", requireAuth, (req, res) => gameController.joinGame(req, res));

// Jouer un coup
router.post("/:gameId/move", requireAuth, (req, res) => gameController.makeMove(req, res));

export default router; 