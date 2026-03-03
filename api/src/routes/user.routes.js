#! http://localhost:3000/api/users
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
const router = express.Router();

// GET http://localhost:3000/api/users
router.get("/", getAllUsers);

// GET http://localhost:3000/api/users/:id
router.get("/:id", getUserById);

// POST http://localhost:3000/api/users
router.post("/", createUser);

// PUT http://localhost:3000/api/users/:id
router.put("/:id", updateUser);

// DELETE http://localhost:3000/api/users/:id
router.delete("/:id", deleteUser);

export default router;
