import mongoose, { Schema } from "mongoose";

const TestMessageSchema = new Schema(
  {
    // الاسم لأي تجربة
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    // الرقم القومي كمثال
    nationalId: {
      type: String,
      required: true,
      unique: true,
      length: 14, // افتراض الرقم القومي المصري
    },
    // محتوى الرسالة
    content: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 2000,
    },
    // صورة / مرفق
    attachment: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    // أي بيانات إضافية للتجربة
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const TestMessage = mongoose.models.TestMessage || mongoose.model("TestMessage", TestMessageSchema);

export default TestMessage;
