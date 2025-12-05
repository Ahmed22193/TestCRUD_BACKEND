import * as dbService from "../../DB/dbService.js";
import { successRespons } from "../../Utils/successRespons.js";
import TestMessage from "../../DB/models/message.models.js"; // هنا تستخدم الموديل اللي هتشتغل عليه
import { importExcel } from "../../../data/xlsx.js";

import XLSX from "xlsx";
import ExcelRecord from "../../DB/models/message.models.js"; // عدل على سكيمتك

// ===== CREATE =====
export const create = async (req, res, next) => {
  try {
    const doc = await dbService.create({ model: TestMessage, data: req.body });

    return successRespons({
      res,
      status: 201,
      message: "Created successfully",
      data: doc,
    });
  } catch (err) {
    next(err);
  }
};

// ===== GET ALL =====
export const getAll = async (req, res, next) => {
  try {
    const docs = await dbService.find({ model: TestMessage });
    // importExcel();
    return successRespons({ res, message: "Fetched successfully", data: docs });
  } catch (err) {
    next(err);
  }
};

// ===== GET ONE =====
export const getOne = async (req, res, next) => {
  try {
    const doc = await dbService.findOne({
      model: TestMessage,
      filter: { _id: req.params.id },
    });

    if (!doc) throw new Error("Document not found");

    return successRespons({ res, message: "Fetched successfully", data: doc });
  } catch (err) {
    next(err);
  }
};

// ===== UPDATE =====
export const update = async (req, res, next) => {
  try {
    const updated = await dbService.updateOne({
      model: TestMessage,
      filter: { _id: req.params.id },
      data: req.body,
    });

    if (!updated) throw new Error("Document not found");

    return successRespons({
      res,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// ===== DELETE =====
export const deleteDocument = async (req, res, next) => {
  try {
    const deleted = await dbService.deleteOne({
      model: TestMessage,
      filter: { _id: req.params.id },
    });

    if (!deleted) throw new Error("Document not found");

    return successRespons({
      res,
      message: "Deleted successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

// ==== upload file ==========

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // قراءة الملف
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // تحويل الشيت لـ JSON
    const rows = XLSX.utils.sheet_to_json(sheet);

    // هنا ممكن تعمل map إذا حابب تظبط أسماء الأعمدة
    const dataToInsert = rows.map((row) => ({
      landLocation: row["مكان الأرض"],
      committee: row["اللجنه"],
      center: row["المركز"],
      unit: row["الوحدة"],
      area: Number(row["المساحة"]),
      type: row["نوعه"],
      requestDate: new Date(row["تاريخ الطلب"]),
      requestNumber: row["رقم الطلب"],
      requestedFor: row["الطلب لصالح"],
      phone: row["التليفون"],
      applicantName: row["مقدم الطلب"],
      nationalId: row["الرقم القومى"],
    }));

    // حفظ البيانات في MongoDB
    const saved = await ExcelRecord.insertMany(dataToInsert);

    res.json({
      message: "Excel imported successfully!",
      inserted: saved.length,
    });
  } catch (err) {
    next(err);
  }
};
