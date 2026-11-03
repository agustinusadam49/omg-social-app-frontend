import * as xlsx from "xlsx";
import { DIARE_LISTS, ISPA_LISTS, DATA_MAP_OBJ } from "../../constants";

const changeObj = (itemObj) => {
  const keys = Object.keys(itemObj);
  const resultObj = {};

  for (let i = 0; i < keys.length; i++) {
    const itemValue = itemObj[keys[i]];

    if (DATA_MAP_OBJ[keys[i]]) {
      resultObj[DATA_MAP_OBJ[keys[i]]] = itemValue;
    } else {
      resultObj[keys[i]] = itemValue;
    }
  }

  return resultObj;
};

const changeArrOutput = (inputArr) => {
  return inputArr.map((item) => changeObj(item));
};

const handleProcessData = (dataArrObj, diseaseType) => {
  const dataHasBeenCapped = [];

  const diagnoseList = diseaseType === "diare" ? DIARE_LISTS : ISPA_LISTS;

  const modifiedDataArr = changeArrOutput(dataArrObj);

  for (let i = 0; i < diagnoseList.length; i++) {
    const slicedData = modifiedDataArr
      .filter((item) => item.icdxOne === diagnoseList[i].disease)
      .map((item) => ({
        number: item?.number ?? "",
        date: item?.date ?? "",
        patientName: item?.patientName ?? "",
        ermNumber: item?.ermNumber ?? "",
        patientAge: item?.patientAge ?? "",
        monthAge: item?.monthAge ?? "",
        medicalPersonnel: item?.medicalPersonnel ?? "",
        icdxOne: item?.icdxOne ?? "",
        diagnoseOne: item?.icdxOne
          ? diagnoseList.find(
              (listOfDiagnose) => listOfDiagnose.disease === item.icdxOne,
            ).description
          : "",
        isAntibiotic: item?.icdxOne
          ? diagnoseList.filter(
              (listOfDiagnose) => listOfDiagnose.disease === item.icdxOne,
            )[0].isAntibiotic
          : "",
        receipt: item?.receipt
          ? item.receipt
              .split(/(?:\r?\n){2,}/)
              .filter((item) => item)
              .map((item) => item.split(/\r?\n/))
              .map((item) => ({
                medicineName: item[0].substring(2),
                signa: item[1].split(":")[1].trim(),
                jumlah: item[2].split(":")[1].trim(),
                racikan: item[3].split(":")[1].trim(),
              }))
          : [],
      }));

    dataHasBeenCapped.push(...slicedData);
  }

  return dataHasBeenCapped;
};

export const readFileAndMergedData = async (
  pathDataRead,
  nameOfSheet,
  typeOfDisease,
) => {
  const contentArrMerged = [];

  for (const pathItem of pathDataRead) {
    const data = await pathItem.arrayBuffer();
    const stokPtData = xlsx.readFile(data, { cellDates: true });
    const sheetData = stokPtData.Sheets[nameOfSheet];
    const arrayOfObjectsDataSheets = xlsx.utils.sheet_to_json(sheetData, {
      range: 25,
    });
    const content = handleProcessData(arrayOfObjectsDataSheets, typeOfDisease);
    contentArrMerged.push(...content);
  }

  return contentArrMerged.sort(
    (itemA, itemB) => new Date(itemA.date) - new Date(itemB.date),
  );
};

export const formattedReceipt = (receiptData) => {
  if (!receiptData.length) return [];

  const finalArr = [];

  for (let i = 0; i < receiptData.length; i++) {
    const modifyName = `${receiptData[i].medicineName.replace(/\btablet\b\s*/gi, "").trim()} Racikan`;
    const nameOfMedicine =
      receiptData[i].racikan.toLowerCase() === "r1"
        ? modifyName
        : receiptData[i].medicineName;

    const objData = {
      medicineName: nameOfMedicine,
      signa: receiptData[i].signa,
      jumlah: receiptData[i].jumlah,
      racikan: receiptData[i].racikan,
    };

    finalArr.push(objData);
  }

  return finalArr;
};
