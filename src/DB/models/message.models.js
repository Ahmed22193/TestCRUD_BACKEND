import mongoose, { Schema } from "mongoose";

const ExcelRecordSchema = new Schema(
  {
    landLocation: {
      type: String, // مكان الأرض
    },
    committee: {
      type: String, // اللجنة
    },
    center: {
      type: String, // المركز
    },
    unit: {
      type: String, // الوحدة
    },
    area: {
      type: Number, // المساحة (مثلاً 10 فدان)
    },
    type: {
      type: String, // نوعه (واضع يد)
    },
    requestDate: {
      type: Date, // تاريخ الطلب
    },
    requestNumber: {
      type: String, // رقم الطلب (138783/57)
    },
    requestedFor: {
      type: String, // الطلب لصالح (مواطن)
    },
    phone: {
      type: String, // التليفون
    },
    applicantName: {
      type: String, // مقدم الطلب
    },
    nationalId: {
      type: String, // الرقم القومي
      unique: true,
    },
  },
  { timestamps: true }
);

const ExcelRecord =
  mongoose.models.ExcelRecord ||
  mongoose.model("ExcelRecord", ExcelRecordSchema);

export default ExcelRecord;
