import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";


const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        max: 1024,
        minlength: 6
    },
    
    picture: {
        type: String,
        default: "./uploads/profil/random-user.png"
    }
},
{
    timestamps: true,
}
);




const UserModel = mongoose.model("Users", userSchema);

export default UserModel;