import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Inscription
export const signup = async (req, res) => {
  try {
    const { pseudo, email, password, confirmPassword } = req.body;

    if (!pseudo || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Missing Fields" });
    }

    // Vérification de la similarité des mdp
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords not similar" });
    }

    // Vérification de l'email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already used" });
    }

    // Vérification du pseudo
    const existingPseudo = await User.findOne({ pseudo });
    if (existingPseudo) {
      return res.status(400).json({ success: false, message: "Pseudo already used" });
    }

    // Salage du mot de passe 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création de l'utilisateur si toute les vérification sont passées 
    const newUser = new User({ pseudo, email, password: hashedPassword });
    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing Fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Passwords not similar" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, pseudo: user.pseudo },
      process.env.JWTOKEN, 
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

