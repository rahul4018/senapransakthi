import express from "express";
import { getSoldierAI } from "../controllers/aiController";

const router = express.Router();

router.get("/:id", getSoldierAI);

export default router;
