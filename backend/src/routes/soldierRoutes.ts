import express from "express";
import multer from "multer";

import {
  addSoldier,
  getAllSoldiers,
  updateSoldier,
  deleteSoldier,
  uploadSoldiersCSV,
} from "../controllers/soldierController";

const router = express.Router();

// Multer config for CSV upload
const upload = multer({ dest: "uploads/" });

/*
  RESTful API structure

  POST   /soldiers          -> Add a soldier
  GET    /soldiers          -> Get all soldiers
  PUT    /soldiers/:id      -> Update soldier
  DELETE /soldiers/:id      -> Delete soldier
  POST   /soldiers/upload   -> Bulk upload soldiers CSV
*/


// ✅ Add Soldier
router.post("/", addSoldier);

// ✅ Get all soldiers
router.get("/", getAllSoldiers);

// ✅ Update soldier
router.put("/:id", updateSoldier);

// ✅ Delete soldier
router.delete("/:id", deleteSoldier);

// ✅ Upload CSV
router.post("/upload", upload.single("file"), uploadSoldiersCSV);

export default router;