import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContexts";
import Header from '../../components/header/Header';
import axios from "axios";
import "./profile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    pseudo: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log("Profile component - user state:", user, "loading:", loading);
    
    // Ne rediriger que si le chargement est terminé et qu'il n'y a pas d'utilisateur
    if (!loading && user === null) {
      console.log("User is null and loading is finished, redirecting to login");
      navigate('/login');
      return;
    }

    // Si l'utilisateur est connecté, initialiser les données d'édition
    if (user) {
      setEditedUser({
        pseudo: user.pseudo || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user, loading, navigate]);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Chargement...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Vérification de votre session...
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection se fera dans le useEffect)
  if (user === null) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    if (!editedUser.email.includes('@')) {
      alert('Email invalide');
      return;
    }
    if (editedUser.password && editedUser.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const updateData = {
        pseudo: editedUser.pseudo,
        email: editedUser.email,
      };

      // Ajouter le mot de passe seulement s'il a été modifié
      if (editedUser.password) {
        updateData.password = editedUser.password;
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/${user._id}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Rafraîchir les données utilisateur
        await fetchUser();
        setIsEditing(false);
        alert('Profil mis à jour avec succès !');
      } else {
        alert(response.data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données utilisateur:", error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  const handleCancel = () => {
    setEditedUser({
      pseudo: user.pseudo || "",
      email: user.email || "",
      password: "",
    });
    setIsEditing(false);
  };

  return (
    <>
    <Header />
    <div className="user-profile">
      <h2>Profil de l'utilisateur</h2>
      {!isEditing ? (
        <div>
          <p>
            <strong>Nom d'utilisateur :</strong> {user.pseudo}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Mot de passe :</strong> ********
          </p>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
        </div>
      ) : (
        <div>
          <label>
            Nom d'utilisateur:
            <input
              type="text"
              name="pseudo"
              value={editedUser.pseudo}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Nouveau mot de passe (optionnel):
            <input
              type="password"
              name="password"
              value={editedUser.password}
              onChange={handleChange}
              placeholder="Laissez vide pour ne pas changer"
            />
          </label>
          <button onClick={handleSave}>Enregistrer</button>
          <button className="cancel-btn" onClick={handleCancel}>
            Annuler
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default UserProfile;
