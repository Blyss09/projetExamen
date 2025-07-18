import Game from "../models/game.model.js";
import morpionController from "./morpion.controller.js";
import shifumiController from "./shifumi.controller.js";

class GameController {
    // Créer une nouvelle partie
    async createGame(req, res) {
        try {
            const { gameType, maxPlayers } = req.body;
            let players = [];
            let gameData = {};
            // Attribution du rôle et initialisation selon le type de jeu
            if (gameType === "morpion") {
                players = [{ user: req.user._id, role: morpionController.getPlayerRole(0) }];
                gameData = morpionController.initializeGameData();
            } else if (gameType === "shifumi") {
                players = [{ user: req.user._id, role: shifumiController.getPlayerRole(0) }];
                gameData = shifumiController.initializeGameData();
            } else {
                // Pour d'autres jeux
                players = [{ user: req.user._id, role: "player" }];
                gameData = {};
            }
            const game = new Game({
                gameType,
                maxPlayers,
                createdBy: req.user._id,
                players,
                gameData
            });
            await game.save();
            res.json(game);
        } catch (err) {
            console.error("Erreur lors de la création de la partie :", err);
            res.status(500).json({ error: "Erreur serveur lors de la création de la partie.", details: err.message });
        }
    }

    // Rejoindre une partie
    async joinGame(req, res) {
        try {
            const { gameId } = req.params;
            const game = await Game.findById(gameId);
            if (!game) {
                return res.status(404).json({ error: "Partie non trouvée" });
            }
            // LOG DEBUG
            console.log("Tentative de join par :", req.user._id.toString());
            console.log("Joueurs déjà dans la partie :", game.players.map(p => p.user.toString()));
            if (game.players.length >= game.maxPlayers) {
                return res.status(400).json({ error: 'Partie complète' });
            }
            if (game.players.some(p => p.user.toString() === req.user._id.toString())) {
                return res.status(400).json({ error: 'Vous êtes déjà dans la partie' });
            }
            // Attribution du rôle selon le type de jeu
            let role = "player";
            if (game.gameType === "morpion") {
                role = morpionController.getPlayerRole(game.players.length);
            } else if (game.gameType === "shifumi") {
                role = shifumiController.getPlayerRole(game.players.length);
            }
            game.players.push({
                user: req.user._id,
                role
            });
            if (game.players.length === game.maxPlayers) {
                game.status = 'in-progress';
                game.currentPlayer = game.players[0].user;
            }
            await game.save();
            res.json(game);
        } catch (err) {
            res.status(500).json({ error: "Erreur serveur lors de la tentative de rejoindre la partie." });
        }
    }

    // Jouer un coup
    async makeMove(req, res) {
        try {
            const { gameId } = req.params;
            const { move } = req.body;
            const game = await Game.findById(gameId);
            if (!game) {
                return res.status(404).json({ error: "Partie non trouvée" });
            }
            if (!game.players.some(p => p.user.toString() === req.user._id.toString())) {
                return res.status(403).json({ error: "Vous ne faites pas partie de cette partie" });
            }
            // Délégation de la logique selon le type de jeu
            let isPlayerTurn = true;
            let isValidMove = true;
            let applyMove = () => {};
            let checkGameEnd = () => ({ isFinished: false });
            let getNextPlayer = () => null;
            if (game.gameType === "morpion") {
                isPlayerTurn = morpionController.isPlayerTurn(game, req.user._id);
                isValidMove = morpionController.isValidMove(game, move);
                applyMove = () => morpionController.applyMove(game, move, req.user._id);
                checkGameEnd = () => morpionController.checkGameEnd(game);
                getNextPlayer = () => morpionController.getNextPlayer(game, req.user._id);
            } else if (game.gameType === "shifumi") {
                isPlayerTurn = shifumiController.isPlayerTurn(game, req.user._id);
                isValidMove = shifumiController.isValidMove(game, move);
                applyMove = () => shifumiController.applyMove(game, move, req.user._id);
                checkGameEnd = () => shifumiController.checkGameEnd(game);
                getNextPlayer = () => shifumiController.getNextPlayer(game, req.user._id);
            }
            if (!isPlayerTurn) {
                return res.status(400).json({ error: 'Pas votre tour' });
            }
            if (!isValidMove) {
                return res.status(400).json({ error: 'Coup invalide' });
            }
            applyMove();
            const gameResult = checkGameEnd();
            if (gameResult.isFinished) {
                game.status = 'finished';
                game.winner = gameResult.winner;
            } else {
                game.currentPlayer = getNextPlayer();
            }
            await game.save();
            res.json(game);
        } catch (err) {
            res.status(500).json({ error: "Erreur serveur lors du coup." });
        }
    }
}

const gameController = new GameController();
export default gameController;