import { Router } from "express";
import * as crudController from "./messages.service.js";
import { cloudFileUpload } from "../../Utils/multer/cloud.multer.js";

const router = Router();

// ===== CREATE =====
router.post("/create", crudController.create);

// ===== GET ALL =====
router.get("/getAll", crudController.getAll);

router.post(
  "/upload-excel",
  cloudFileUpload({
    validation: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  }).single("xlsx"),
  crudController.uploadFile
);


// ===== GET ONE =====
router.get("/getOne/:id", crudController.getOne);

// ===== UPDATE =====
router.patch("/update/:id", crudController.update);

// ===== DELETE =====
router.delete("/deleteDocument/:id", crudController.deleteDocument);

export default router;
