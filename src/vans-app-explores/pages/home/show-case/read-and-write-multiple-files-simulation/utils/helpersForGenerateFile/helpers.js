import * as xlsx from "xlsx";
import { DIARE_LISTS, ISPA_LISTS, DATA_MAP_OBJ } from "../../constants";
// import { DUMMY_PATIENTS_DATA } from "../../dummyConstants" // just for testing

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
      // .slice(0, 1)
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
        receipt: item?.receipt ?? "",
      }));

    dataHasBeenCapped.push(...slicedData);
  }

  return dataHasBeenCapped;
};

const patientSelection = (patiens, antibioticCount) => {
  const antibioticData = patiens
    .filter((item) => item.isAntibiotic)
    .sort((itemA, itemB) => new Date(itemA.date) - new Date(itemB.date));
  const nonAntibioticData = patiens
    .filter((item) => !item.isAntibiotic)
    .sort((itemA, itemB) => new Date(itemA.date) - new Date(itemB.date));

  if (antibioticCount < 3 && antibioticData.length) return antibioticData[0];

  return nonAntibioticData.length ? nonAntibioticData[0] : antibioticData[0];
};

const generateDateObject = (patientsDataArr) => {
  return patientsDataArr.reduce((newObj, content) => {
    const { date } = content;

    const onlyDate = date.split(" ")[0];

    if (newObj[onlyDate]) {
      newObj[onlyDate].push(content);
    } else {
      newObj[onlyDate] = [content];
    }

    return newObj;
  }, {});
};

export const generateDateResultV2 = (dataArr) => {
  const byDateObj = generateDateObject(dataArr);

  const objKeys = Object.keys(byDateObj);

  let antibioticCounter = 0;

  const finalResultOfArrPatients = objKeys.reduce((newArr, item) => {
    const patientDataArrPerDate = byDateObj[item];

    const currentPatientSelected = patientSelection(
      patientDataArrPerDate,
      antibioticCounter,
    );

    if (currentPatientSelected.isAntibiotic) {
      antibioticCounter += 1;
    }

    newArr.push(currentPatientSelected);

    return newArr;
  }, []);

  return finalResultOfArrPatients;
};

export const processAddNewInsufficientData = (
  originalDataArr,
  finalDataArr,
) => {
  const insufficientDataAmount = 25 - finalDataArr.length;

  const newArrFromOriginal = [];
  const indexUsedArr = [];

  while (
    (newArrFromOriginal.length && indexUsedArr.length) < insufficientDataAmount
  ) {
    const randomIndex = Math.floor(Math.random() * originalDataArr.length);

    const currentItemByOriData = originalDataArr[randomIndex];

    const isThereDataInFinalArr = !!finalDataArr.filter(
      (finalDataItem) => currentItemByOriData.number === finalDataItem.number,
    ).length;

    const isThereIndexUsed = indexUsedArr.includes(randomIndex);

    if (!isThereDataInFinalArr && !isThereIndexUsed) {
      newArrFromOriginal.push(currentItemByOriData);
      indexUsedArr.push(randomIndex);
    }
  }

  return newArrFromOriginal;
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
