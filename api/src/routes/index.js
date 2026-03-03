#! http://localhost:3000/api
// Routes->index (API)
import express from "express";
import userRoutes from "./user.routes.js";
import aiRoutes from "./ai.routes.js";
const router = express.Router();

router.use("/users", userRoutes);  
router.use("/ai", aiRoutes);

router.get("/ping", (req, res) => {
  res.json({ message: "Hello from Express 👋" });
});

router.get("/", (req, res) => {
  res.json({ message: "Hello API from Express !!!" });
});

export default router;
