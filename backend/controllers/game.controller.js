import Game from "../models/game.model.js";
import morpionController from "./morpion.controller.js";

class GameController {
    // Créer une nouvelle partie
    async createGame(req, res) {
        try {
            const { gameType, maxPlayers } = req.body;
            let players = [];
            let gameData = {};
            // Attribution du rôle et initialisation selon le type de jeu
            if (gameType === "tic-tac-toe") {
                players = [{ user: req.user.id, role: morpionController.getPlayerRole(0) }];
                gameData = morpionController.initializeGameData();
            } else {
                // Pour d'autres jeux, à compléter
                players = [{ user: req.user.id, role: "player" }];
                gameData = {};
            }
            const game = new Game({
                gameType,
                maxPlayers,
                createdBy: req.user.id,
                players,
                gameData
            });
            await game.save();
            res.json(game);
        } catch (err) {
            res.status(500).json({ error: "Erreur serveur lors de la création de la partie." });
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
            if (game.players.length >= game.maxPlayers) {
                return res.status(400).json({ error: 'Partie complète' });
            }
            if (game.players.some(p => p.user.toString() === req.user.id)) {
                return res.status(400).json({ error: 'Vous êtes déjà dans la partie' });
            }
            // Attribution du rôle selon le type de jeu
            let role = "player";
            if (game.gameType === "tic-tac-toe") {
                role = morpionController.getPlayerRole(game.players.length);
            }
            game.players.push({
                user: req.user.id,
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
            if (!game.players.some(p => p.user.toString() === req.user.id)) {
                return res.status(403).json({ error: "Vous ne faites pas partie de cette partie" });
            }
            // Délégation de la logique selon le type de jeu
            let isPlayerTurn = true;
            let isValidMove = true;
            let applyMove = () => {};
            let checkGameEnd = () => ({ isFinished: false });
            let getNextPlayer = () => null;
            if (game.gameType === "tic-tac-toe") {
                isPlayerTurn = morpionController.isPlayerTurn(game, req.user.id);
                isValidMove = morpionController.isValidMove(game, move);
                applyMove = () => morpionController.applyMove(game, move, req.user.id);
                checkGameEnd = () => morpionController.checkGameEnd(game);
                getNextPlayer = () => morpionController.getNextPlayer(game, req.user.id);
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