import express from "express";

import { getUser, updateUser, deleteUser, getUserById } from '../controllers/user.controller.js';
import { signup, login, logout } from "../controllers/auth.controller.js";
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route GET pour récupérer tous les utilisateurs
router.get("/", getUser);

// Route GET pour récupérer un utilisateur (avec son ID)
router.get("/:id", getUserById);

// Route POST pour créer un nouvel utilisateur
router.post("/signup", signup);

// Route POST pour login l'utilisateur
router.post("/login", login);

// Route POST pour logout l'utilisateur
router.post("/logout", logout);

// Route PUT pour mettre à jour un utilisateur existant (avec son ID)
router.put("/:id", updateUser);

// Route DELETE pour supprimer un utilisateur (avec son ID)
router.delete("/:id", deleteUser);

router.get('/', requireAuth, (req, res) => {
  res.json({ message: "Accès autorisé !", user: req.user });
});

export default router;