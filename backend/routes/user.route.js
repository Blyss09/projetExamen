import express from "express";
import { getUser, createUser, updateUser, deleteUser }from '../controllers/user.controller.js';

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;