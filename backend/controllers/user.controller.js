import User from "../models/users.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  try {
    const users = await User.find({}); // Recherche de tous les utilisateurs dans la base de données
    res.status(200).json({ success: true, data: users }); // Envoi de la réponse avec les utilisateurs trouvés
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête
  const updateData = { ...req.body }; // Récupération des données de mise à jour

  if (!mongoose.Types.ObjectId.isValid(id)) {
    // Vérification de la validité de l'ID
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    // Si un nouveau mot de passe est fourni, le hasher
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      // Supprimer le champ password s'il n'est pas fourni
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ); // Mise à jour de l'utilisateur

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ne pas renvoyer le mot de passe
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

  try {
    await User.findByIdAndDelete(id); // Suppression de l'utilisateur
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: "User not found" });
  }
};


