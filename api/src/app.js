import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();

app.use(cors());
// Middlewares
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
