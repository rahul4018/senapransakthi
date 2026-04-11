import { Router } from "express";
import multer from "multer";

import {
  addHealthRecord,
  uploadHealthCSV,
  getAllHealth,
  getHealthBySoldier,
} from "../controllers/healthController";

const router = Router();

// Configure multer for CSV uploads
const upload = multer({ dest: "uploads/" });

/*
  Health Records API

  POST   /health/add            -> Add manual health record
  POST   /health/upload         -> Upload CSV health dataset
  GET    /health                -> Get all health records
  GET    /health/:soldierId     -> Get health records for specific soldier
*/


// ✅ Add manual health record
router.post("/add", addHealthRecord);


// ✅ Upload CSV health dataset
router.post("/upload", upload.single("file"), uploadHealthCSV);


// ✅ Get all health records
router.get("/", getAllHealth);


// ✅ Get health records for a specific soldier
router.get("/:soldierId", getHealthBySoldier);


export default router;