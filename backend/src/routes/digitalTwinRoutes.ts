import express from "express";
import { getDigitalTwin } from "../controllers/digitalTwinController";

const router = express.Router();

router.get("/:id", getDigitalTwin);

export default router;
