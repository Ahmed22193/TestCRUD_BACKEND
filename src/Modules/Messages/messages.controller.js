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
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ],
  }).single("xlsx"),
  crudController.uploadFile
);
router.delete("/deleteAll", crudController.deleteAll);


// ===== GET ONE =====
router.get("/getOne/:id", crudController.getOne);

// ===== UPDATE =====
router.patch("/update/:id", crudController.update);

// ===== DELETE =====
router.delete("/deleteDocument/:id", crudController.deleteDocument);

export default router;
