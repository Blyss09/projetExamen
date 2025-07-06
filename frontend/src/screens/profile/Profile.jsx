import { useState, useEffect } from "react";
import "./profile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    fetch("http://localhost/cool_games/public/setUser.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user);
          setEditedUser(data.user);
        } else {
          console.error("Erreur de l'API :", data.message);
        }
      })
      .catch((error) => console.error("Erreur lors de la récupération des données utilisateur :", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
    if (!editedUser.email.includes('@')) {
      alert('Email invalide');
      return;
    }
    if (editedUser.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    fetch("http://localhost/cool_games/public/setUser.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(editedUser);
          setIsEditing(false);
        } else {
          alert(data.message);
        }
      })
      .catch((error) =>
        console.error(
          "Erreur lors de l'enregistrement des données utilisateur:",
          error
        )
      );
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <h2>Profil de l'utilisateur</h2>
      {!isEditing ? (
        <div>
          <p>
            <strong>Nom d'utilisateur :</strong> {user.username}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Mot de passe :</strong> ********
          </p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <div>
          <label>
            Nom d'utilisateur:
            <input
              type="text"
              name="username"
              value={editedUser.username}
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
            Mot de passe:
            <input
              type="password"
              name="password"
              value={editedUser.password}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
