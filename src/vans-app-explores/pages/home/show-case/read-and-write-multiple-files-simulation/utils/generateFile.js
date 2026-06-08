import * as xlsx from "xlsx";

import {
  readFileAndMergedData,
  generateDateResultV2,
  processAddNewInsufficientData,
} from "./helpersForGenerateFile/helpers.js";

export const generateContentFileOps = async ({
  readPath,
  writePath,
  sheetName,
  diseaseType,
}) => {
  let posibleInsufficientData = [];

  const contentSortedByDate = await readFileAndMergedData(
    readPath,
    sheetName,
    diseaseType,
  );

  console.log("contentSortedByDate:", contentSortedByDate);

  const resultMappedByStatus =
    contentSortedByDate.length > 25
      ? generateDateResultV2(contentSortedByDate)
      : contentSortedByDate;

  console.log("resultMappedByStatus:", resultMappedByStatus);

  if (resultMappedByStatus.length < 25 && contentSortedByDate.length >= 25) {
    console.log("data final kurang dari 25 data");

    const additionalArrData = processAddNewInsufficientData(
      contentSortedByDate,
      resultMappedByStatus,
    );

    posibleInsufficientData = additionalArrData;
  }

  console.log("posibleInsufficientData:", posibleInsufficientData);

  const finalAntibioticPatients = resultMappedByStatus
    .concat(posibleInsufficientData)
    .filter((item) => item.isAntibiotic);

  const finalResult = resultMappedByStatus
    .concat(posibleInsufficientData)
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
        "ICD-X 1": item.icdxOne,
        DIAGNOSIS: item.diagnoseOne,
        "ANTIBIOTIK YA / TIDAK": item.isAntibiotic ? 1 : 0,
        "NAMA OBAT": item.receipt,
      };
    });

  console.log("jumlah antibiotic:", finalAntibioticPatients);
  console.log("mapped final result ready to download:", finalResult);

  const workSheet = xlsx.utils.json_to_sheet(finalResult);
  const woorkBook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(woorkBook, workSheet, "Sheet 1");

  try {
    // fs.writeFileSync(writePath, finalResultContentStr);
    xlsx.writeFile(woorkBook, writePath);
    console.log("content successfully written");
    console.log("total data:", finalResult.length);
  } catch (err) {
    console.error("Waduuh error Broo / Siss!!:", err);
  }
};
