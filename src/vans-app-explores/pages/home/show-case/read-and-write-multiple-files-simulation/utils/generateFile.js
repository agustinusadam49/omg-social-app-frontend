import * as xlsx from "xlsx";
import { DIARE_LISTS, ISPA_LISTS } from "../constants";

const handleProcessData = (dataArrObj, diseaseType) => {
  const dataHasBeenCapped = [];

  const diagnoseList = diseaseType === "diare" ? DIARE_LISTS : ISPA_LISTS;

  for (let i = 0; i < diagnoseList.length; i++) {
    const slicedData = dataArrObj
      .filter((item) => item.icdxOne === diagnoseList[i].disease)
      .slice(0, 1)
      .map((item) => ({
        number: item.number,
        date: item.date,
        patientName: item.patientName,
        ermNumber: item.ermNumber,
        patientAge: item.patientAge,
        monthAge: item.monthAge,
        medicalPersonnel: item.medicalPersonnel,
        icdxOne: item.icdxOne,
        diagnoseOne: diagnoseList.find(
          (listOfDiagnose) => listOfDiagnose.disease === item.icdxOne
        ).description,
        isAntibiotic: diagnoseList.filter(
          (listOfDiagnose) => listOfDiagnose.disease === item.icdxOne
        )[0].isAntibiotic,
        receipt: item.receipt,
      }));

    dataHasBeenCapped.push(...slicedData);
  }

  return dataHasBeenCapped;
};

export const generateContentFileOps = async ({
  readPath,
  writePath,
  sheetName,
  diseaseType,
}) => {
  const contentArrMerged = [];

  for (let i = 0; i < readPath.length; i++) {
    const data = await readPath[i].arrayBuffer();
    const stokPtData = xlsx.readFile(data, { cellDates: true });
    const sheetData = stokPtData.Sheets[sheetName];
    const arrayOfObjectsDataSheets = xlsx.utils.sheet_to_json(sheetData);
    const content = handleProcessData(arrayOfObjectsDataSheets, diseaseType);
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
        "ICD-X 1": item.icdxOne,
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
