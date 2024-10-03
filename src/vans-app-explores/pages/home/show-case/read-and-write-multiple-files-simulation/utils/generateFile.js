// OLAHAN DATA UNTUK PENYAKIT ISPA BULAN MEI 2024

// const xlsx = require("xlsx");
import * as xlsx from "xlsx";

export const generateContentFileOps = async ({
  readPath,
  writePath,
  sheetName,
  handleProcessData,
}) => {
  const contentArrMerged = [];

  for (let i = 0; i < readPath.length; i++) {
    const data = await readPath[i].arrayBuffer();
    const stokPtData = xlsx.readFile(data, { cellDates: true });
    const sheetData = stokPtData.Sheets[sheetName];
    const arrayOfObjectsDataSheets = xlsx.utils.sheet_to_json(sheetData);
    const content = handleProcessData(arrayOfObjectsDataSheets);
    contentArrMerged.push(...content);
  }

  const contentSortedByDate = contentArrMerged
    .sort((itemA, itemB) => new Date(itemA.date) - new Date(itemB.date))
    .map((item, idx) => {
      return {
        TGL: item.date,
        NO: idx + 1,
        NAMA: item.patientName,
        UMUR: item.patientAge,
        "UMUR BULAN": item.monthAge,
        "NO.REG": item.ermNumber,
        DOKTER: item.medicalPersonnel,
        DIAGNOSIS: item.diagnoseOne,
        "ANTIBIOTIK YA / TIDAK": item.isAntibiotic ? 1 : 0,
        "NAMA OBAT": item.receipt,
      };
    });

  const workSheet = xlsx.utils.json_to_sheet(contentSortedByDate);
  const woorkBook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(woorkBook, workSheet, "Sheet 1");

  try {
    // fs.writeFileSync(writePath, finalResultContentStr);
    xlsx.writeFile(woorkBook, writePath);
    console.log("content successfully written");
    console.log("total data:", contentSortedByDate.length);
  } catch (err) {
    console.error("Waduuh error Broo / Siss!!:", err);
  }
};
