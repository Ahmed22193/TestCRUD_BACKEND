import XLSX from "xlsx";
import ExcelRecord from "../src/DB/models/message.models.js";

export const importExcel = async () => {
  try {
    // 1) قراءة الملف
    const workbook = XLSX.readFile("data/users.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 2) تحوله JSON بالعناوين العربية
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const mapping = {
      "مكان الأرض": "landLocation",
      اللجنه: "committee",
      المركز: "center",
      الوحدة: "unit",
      المساحة: "area",
      نوعه: "type",
      "تاريخ الطلب": "requestDate",
      "رقم الطلب": "requestNumber",
      "الطلب لصالح": "requestedFor",
      التليفون: "phone",
      "مقدم الطلب": "applicantName",
      "الرقم القومى": "nationalId",
    };

    // 3) تحويل كل object بناء على mapping
    const finalData = rawData.map((row) => {
      const obj = {};

      for (let key in row) {
        const newKey = mapping[key];
        if (newKey) {
          // معالجة التاريخ لو محتاج
          if (newKey === "requestDate") {
            obj[newKey] = new Date(row[key]);
          } else {
            obj[newKey] = row[key];
          }
        }
      }

      return obj;
    });

    // 4) إدخال البيانات
    await ExcelRecord.insertMany(finalData);

    console.log("Imported:", finalData.length);
  } catch (err) {
    console.error(err);
  }
};
