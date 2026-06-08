// OLD FUNCTIONS HELPER

// const processAntibioticStatus = (patients) => {
//   const antibioticPatients = patients.filter((patient) => patient.isAntibiotic);
//   const nonAntibioticPatients = patients.filter(
//     (patient) => !patient.isAntibiotic,
//   );

//   if (antibioticPatients.length && !nonAntibioticPatients.length) {
//     return ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC;
//   } else if (antibioticPatients.length > nonAntibioticPatients.length) {
//     return ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC;
//   } else if (antibioticPatients.length === nonAntibioticPatients.length) {
//     return ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG;
//   } else if (!antibioticPatients.length && nonAntibioticPatients.length) {
//     return ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC;
//   } else if (antibioticPatients.length < nonAntibioticPatients.length) {
//     return ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC;
//   }

//   return ANTIBIOTIC_STATUS_MAP_OBJ.ALL_DATA_EMPTY;
// };

// const constructObjWithStatus = (dateArr, dateMapObj) => {
//   const newObjMapped = {};
//   for (let i = 0; i < dateArr.length; i++) {
//     const allPatients = dateMapObj[dateArr[i]];
//     const onlyAntibioticArr = allPatients.filter(
//       (patient) => patient.isAntibiotic,
//     );
//     const onlyNonAntibioticArr = allPatients.filter(
//       (patient) => !patient.isAntibiotic,
//     );

//     const status = processAntibioticStatus(allPatients);

//     newObjMapped[dateArr[i]] = {
//       arrData: allPatients,
//       antibioticArrData: onlyAntibioticArr,
//       nonAntibioticArrData: onlyNonAntibioticArr,
//       antibioticStatus: status,
//     };
//   }

//   return newObjMapped;
// };

// const processSortByStatus = (dateArr, mappedObjWithStatus) => {
//   const allAntibiotic = dateArr.reduce((newArr, currentDate) => {
//     if (
//       mappedObjWithStatus[currentDate].antibioticStatus ===
//       ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC
//     ) {
//       newArr.push(mappedObjWithStatus[currentDate]);
//     }

//     return newArr;
//   }, []);

//   const moreAntibioticThanNonAntibiotic = dateArr.reduce(
//     (newArr, currentDate) => {
//       if (
//         mappedObjWithStatus[currentDate].antibioticStatus ===
//         ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC
//       ) {
//         newArr.push(mappedObjWithStatus[currentDate]);
//       }

//       return newArr;
//     },
//     [],
//   );

//   const allTheSame = dateArr.reduce((newArr, currentDate) => {
//     if (
//       mappedObjWithStatus[currentDate].antibioticStatus ===
//       ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG
//     ) {
//       newArr.push(mappedObjWithStatus[currentDate]);
//     }

//     return newArr;
//   }, []);

//   const moreNonAntibioticThanAntibiotic = dateArr.reduce(
//     (newArr, currentDate) => {
//       if (
//         mappedObjWithStatus[currentDate].antibioticStatus ===
//         ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC
//       ) {
//         newArr.push(mappedObjWithStatus[currentDate]);
//       }

//       return newArr;
//     },
//     [],
//   );

//   const allNonAntibiotic = dateArr.reduce((newArr, currentDate) => {
//     if (
//       mappedObjWithStatus[currentDate].antibioticStatus ===
//       ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC
//     ) {
//       newArr.push(mappedObjWithStatus[currentDate]);
//     }

//     return newArr;
//   }, []);

//   const allDataEmpty = dateArr.reduce((newArr, currentDate) => {
//     if (
//       mappedObjWithStatus[currentDate].antibioticStatus ===
//       ANTIBIOTIC_STATUS_MAP_OBJ.ALL_DATA_EMPTY
//     ) {
//       newArr.push(mappedObjWithStatus[currentDate]);
//     }

//     return newArr;
//   }, []);

//   return [
//     ...allAntibiotic,
//     ...moreAntibioticThanNonAntibiotic,
//     ...allTheSame,
//     ...moreNonAntibioticThanAntibiotic,
//     ...allNonAntibiotic,
//     ...allDataEmpty,
//   ];
// };

// const generateDateResult = (dataArr) => {
//   const byDateObj = generateDateObject(dataArr);

//   const objKeys = Object.keys(byDateObj);

//   const dateObjMappedWithStatus = constructObjWithStatus(objKeys, byDateObj);

//   const sortedArrByStatus = processSortByStatus(
//     objKeys,
//     dateObjMappedWithStatus,
//   );

//   const processFinalResult = sortedArrByStatus.reduce((newArr, item, index) => {
//     const { antibioticStatus } = item;
//     const status = antibioticStatus;
//     const emptyDataObj = {
//       number: 0,
//       date: "",
//       patientName: "",
//       ermNumber: "",
//       patientAge: "",
//       monthAge: "",
//       medicalPersonnel: "",
//       icdxOne: "",
//       diagnoseOne: "",
//       isAntibiotic: false,
//       receipt: "",
//     };

//     if (index < 3) {
//       if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC) {
//         newArr.push(item.arrData[0]);
//       } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC) {
//         newArr.push(item.antibioticArrData[0]);
//       } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG) {
//         newArr.push(item.antibioticArrData[0]);
//       } else if (
//         status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC
//       ) {
//         newArr.push(item.antibioticArrData[0]);
//       } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC) {
//         newArr.push(item.arrData[0]);
//       } else {
//         newArr.push(emptyDataObj);
//       }
//     } else {
//       if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_ANTIBIOTIC) {
//         newArr.push(item.arrData[0]);
//       } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_ANTIBIOTIC) {
//         newArr.push(item.nonAntibioticArrData[0]);
//       } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEIMBANG) {
//         newArr.push(item.nonAntibioticArrData[0]);
//       } else if (
//         status === ANTIBIOTIC_STATUS_MAP_OBJ.LEBIH_BANYAK_NON_ANTIBIOTIC
//       ) {
//         newArr.push(item.nonAntibioticArrData[0]);
//       } else if (status === ANTIBIOTIC_STATUS_MAP_OBJ.SEMUA_NON_ANTIBIOTIC) {
//         newArr.push(item.arrData[0]);
//       } else {
//         newArr.push(emptyDataObj);
//       }
//     }
//     return newArr;
//   }, []);

//   return processFinalResult;
// };
