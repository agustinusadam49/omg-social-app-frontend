import * as xlsx from "xlsx";
import {
  DIARE_LISTS,
  ISPA_LISTS,
  DATA_MAP_OBJ,
  ANTIBIOTIC_STATUS_MAP_OBJ,
} from "../constants";

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

const processAntibioticStatus = (patients) => {
  const antibioticPatients = patients.filter((patient) => patient.isAntibiotic);
  const nonAntibioticPatients = patients.filter(
    (patient) => !patient.isAntibiotic,
  );

  if (antibioticPatients.length && !nonAntibioticPatients.length) {
    return ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC;
  } else if (antibioticPatients.length > nonAntibioticPatients.length) {
    return ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC;
  } else if (antibioticPatients.length === nonAntibioticPatients.length) {
    return ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG;
  } else if (!antibioticPatients.length && nonAntibioticPatients.length) {
    return ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC;
  } else if (antibioticPatients.length < nonAntibioticPatients.length) {
    return ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC;
  }

  return ANTIBIOTIC_STATUS_MAP_OBJ.ALL_DATA_EMPTY;
};

const constructObjWithStatus = (dateArr, dateMapObj) => {
  const newObjMapped = {};
  for (let i = 0; i < dateArr.length; i++) {
    const allPatients = dateMapObj[dateArr[i]];
    const onlyAntibioticArr = allPatients.filter(
      (patient) => patient.isAntibiotic,
    );
    const onlyNonAntibioticArr = allPatients.filter(
      (patient) => !patient.isAntibiotic,
    );

    const status = processAntibioticStatus(allPatients);

    newObjMapped[dateArr[i]] = {
      arrData: allPatients,
      antibioticArrData: onlyAntibioticArr,
      nonAntibioticArrData: onlyNonAntibioticArr,
      antibioticStatus: status,
    };
  }

  return newObjMapped;
};

const processSortByStatus = (dateArr, mappedObjWithStatus) => {
  const allAntibiotic = dateArr.reduce((newArr, currentDate) => {
    if (
      mappedObjWithStatus[currentDate].antibioticStatus ===
      ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC
    ) {
      newArr.push(mappedObjWithStatus[currentDate]);
    }

    return newArr;
  }, []);

  const moreAntibioticThanNonAntibiotic = dateArr.reduce(
    (newArr, currentDate) => {
      if (
        mappedObjWithStatus[currentDate].antibioticStatus ===
        ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC
      ) {
        newArr.push(mappedObjWithStatus[currentDate]);
      }

      return newArr;
    },
    [],
  );

  const allTheSame = dateArr.reduce((newArr, currentDate) => {
    if (
      mappedObjWithStatus[currentDate].antibioticStatus ===
      ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG
    ) {
      newArr.push(mappedObjWithStatus[currentDate]);
    }

    return newArr;
  }, []);

  const moreNonAntibioticThanAntibiotic = dateArr.reduce(
    (newArr, currentDate) => {
      if (
        mappedObjWithStatus[currentDate].antibioticStatus ===
        ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC
      ) {
        newArr.push(mappedObjWithStatus[currentDate]);
      }

      return newArr;
    },
    [],
  );

  const allNonAntibiotic = dateArr.reduce((newArr, currentDate) => {
    if (
      mappedObjWithStatus[currentDate].antibioticStatus ===
      ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC
    ) {
      newArr.push(mappedObjWithStatus[currentDate]);
    }

    return newArr;
  }, []);

  const allDataEmpty = dateArr.reduce((newArr, currentDate) => {
    if (
      mappedObjWithStatus[currentDate].antibioticStatus ===
      ANTIBIOTIC_STATUS_MAP_OBJ.ALL_DATA_EMPTY
    ) {
      newArr.push(mappedObjWithStatus[currentDate]);
    }

    return newArr;
  }, []);

  return [
    ...allAntibiotic,
    ...moreAntibioticThanNonAntibiotic,
    ...allTheSame,
    ...moreNonAntibioticThanAntibiotic,
    ...allNonAntibiotic,
    ...allDataEmpty,
  ];
};

const generateDateResult = (dataArr) => {
  const byDateObj = dataArr.reduce((newObj, content) => {
    const { date } = content;

    const onlyDate = date.split(" ")[0];

    if (newObj[onlyDate]) {
      newObj[onlyDate].push(content);
    } else {
      newObj[onlyDate] = [content];
    }

    return newObj;
  }, {});

  const objKeys = Object.keys(byDateObj);

  const dateObjMappedWithStatus = constructObjWithStatus(objKeys, byDateObj);

  const sortedArrByStatus = processSortByStatus(
    objKeys,
    dateObjMappedWithStatus,
  );

  const processFinalResult = sortedArrByStatus.reduce((newArr, item, index) => {
    const { antibioticStatus } = item;
    const status = antibioticStatus;
    const emptyDataObj = {
      number: 0,
      date: "",
      patientName: "",
      ermNumber: "",
      patientAge: "",
      monthAge: "",
      medicalPersonnel: "",
      icdxOne: "",
      diagnoseOne: "",
      isAntibiotic: false,
      receipt: "",
    };

    if (index < 3) {
      if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC) {
        newArr.push(item.arrData[0]);
      } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC) {
        newArr.push(item.antibioticArrData[0]);
      } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG) {
        newArr.push(item.antibioticArrData[0]);
      } else if (
        status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC
      ) {
        newArr.push(item.antibioticArrData[0]);
      } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC) {
        newArr.push(item.arrData[0]);
      } else {
        newArr.push(emptyDataObj);
      }
    } else {
      if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC) {
        newArr.push(item.arrData[0]);
      } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC) {
        newArr.push(item.nonAntibioticArrData[0]);
      } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG) {
        newArr.push(item.nonAntibioticArrData[0]);
      } else if (
        status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC
      ) {
        newArr.push(item.nonAntibioticArrData[0]);
      } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC) {
        newArr.push(item.arrData[0]);
      } else {
        newArr.push(emptyDataObj);
      }
    }
    return newArr;
  }, []);

  return processFinalResult;
};

const processAddNewInsufficientData = (originalDataArr, finalDataArr) => {
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

export const generateContentFileOps = async ({
  readPath,
  writePath,
  sheetName,
  diseaseType,
}) => {
  let posibleInsufficientData = [];
  const contentArrMerged = [];

  for (let i = 0; i < readPath.length; i++) {
    const data = await readPath[i].arrayBuffer();
    const stokPtData = xlsx.readFile(data, { cellDates: true });
    const sheetData = stokPtData.Sheets[sheetName];
    const arrayOfObjectsDataSheets = xlsx.utils.sheet_to_json(sheetData, {
      range: 25,
    });
    const content = handleProcessData(arrayOfObjectsDataSheets, diseaseType);
    contentArrMerged.push(...content);
  }

  const contentSortedByDate = contentArrMerged.sort(
    (itemA, itemB) => new Date(itemA.date) - new Date(itemB.date),
  );
  console.log("contentSortedByDate:", contentSortedByDate);

  const resultMappedByStatus =
    contentSortedByDate.length > 25
      ? generateDateResult(contentSortedByDate)
      : contentSortedByDate;

  console.log("resultMappedByStatus:", resultMappedByStatus);

  if (resultMappedByStatus.length < 25 && contentSortedByDate.length >= 25) {
    console.log(
      `total data ${diseaseType} adalah: ${contentSortedByDate.length}`,
    );
    console.log("data final kurang dari 25 data");

    const additionalArrData = processAddNewInsufficientData(
      contentSortedByDate,
      resultMappedByStatus,
    );

    posibleInsufficientData = additionalArrData;

    console.log("posibleInsufficientData:", posibleInsufficientData);
  }

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
