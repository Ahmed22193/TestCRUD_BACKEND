import { Router } from "express";
import * as crudController from "./messages.service.js";

const router = Router();

// ===== CREATE =====
router.post("/create", crudController.create);

// ===== GET ALL =====
router.get("/getAll", crudController.getAll);

// ===== GET ONE =====
router.get("/getOne/:id", crudController.getOne);

// ===== UPDATE =====
router.patch("/update/:id", crudController.update);

// ===== DELETE =====
router.delete("/deleteDocument/:id", crudController.deleteDocument);

export default router;
