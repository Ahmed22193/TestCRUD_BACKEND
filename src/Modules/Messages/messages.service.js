import * as dbService from "../../DB/dbService.js";
import { successRespons } from "../../Utils/successRespons.js";
import TestMessage from "../../DB/models/message.models.js"; // هنا تستخدم الموديل اللي هتشتغل عليه

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

    return successRespons({ res, message: "Fetched successfully", data: docs });
  } catch (err) {
    next(err);
  }
};

// ===== GET ONE =====
export const getOne = async (req, res, next) => {
  try {
    const doc = await dbService.findOne({ model: TestMessage, filter: { _id: req.params.id } });

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

    return successRespons({ res, message: "Updated successfully", data: updated });
  } catch (err) {
    next(err);
  }
};

// ===== DELETE =====
export const deleteDocument = async (req, res, next) => {
  try {
    const deleted = await dbService.deleteOne({ model: TestMessage, filter: { _id: req.params.id } });

    if (!deleted) throw new Error("Document not found");

    return successRespons({ res, message: "Deleted successfully", data: deleted });
  } catch (err) {
    next(err);
  }
};
