import jwt from 'jsonwebtoken';
import UserModel from '../models/users.model.js';  

export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

export const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                console.log(decodedToken.id);
                res.locals.userId = decodedToken.id;
                next();
            }
        });
    } else {
        console.log('No token');
        return res.status(401).json({ message: "Unauthorized" });
    }
};
