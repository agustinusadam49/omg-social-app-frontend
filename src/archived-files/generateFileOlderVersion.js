import * as xlsx from "xlsx";

import {
  readFileAndMergedData,
  // generateDateResultV2,
  // processAddNewInsufficientData,
} from "./helpersForGenerateFile/helpers.js";

const formatedReceipt = (receiptData) => {
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

export const generateContentFileOps = async ({
  readPath,
  writePath,
  sheetName,
  diseaseType,
}) => {
  // let posibleInsufficientData = [];

  const contentSortedByDate = await readFileAndMergedData(
    readPath,
    sheetName,
    diseaseType,
  );

  // const resultMappedByStatus =
  //   contentSortedByDate.length > 25
  //     ? generateDateResultV2(contentSortedByDate)
  //     : contentSortedByDate;

  // console.log("resultMappedByStatus:", resultMappedByStatus);

  // if (resultMappedByStatus.length < 25 && contentSortedByDate.length >= 25) {
  //   console.log("data final kurang dari 25 data");

  //   const additionalArrData = processAddNewInsufficientData(
  //     contentSortedByDate,
  //     resultMappedByStatus,
  //   );

  //   posibleInsufficientData = additionalArrData;
  // }

  // console.log("posibleInsufficientData:", posibleInsufficientData);

  // const finalAntibioticPatients = resultMappedByStatus
  //   .concat(posibleInsufficientData)
  //   .filter((item) => item.isAntibiotic);

  // const finalResult = resultMappedByStatus
  //   .concat(posibleInsufficientData)
  //   .sort((itemA, itemB) => new Date(itemA.date) - new Date(itemB.date))
  //   .map((item, idx) => {
  //     return {
  //       TGL: item.date,
  //       NO: idx + 1,
  //       NAMA: item.patientName,
  //       UMUR: item.patientAge,
  //       "UMUR BULAN": item.monthAge,
  //       "NO.REG": item.ermNumber,
  //       DOKTER: item.medicalPersonnel,
  //       "ICD-X 1": item.icdxOne,
  //       DIAGNOSIS: item.diagnoseOne,
  //       "ANTIBIOTIK YA / TIDAK": item.isAntibiotic ? 1 : 0,
  //       "NAMA OBAT": item.receipt,
  //     };
  //   });

  // console.log("jumlah antibiotic:", finalAntibioticPatients);
  // console.log("mapped final result ready to download:", finalResult);

  const mappedContent = contentSortedByDate.map((item) => ({
    ...item,
    receipt: formatedReceipt(item.receipt),
  }));

  console.log("mappedContent:", mappedContent);

  const headers = [
    "TGL",
    "NO",
    "NAMA",
    "UMUR",
    "NO.REG",
    "DOKTER",
    "DIAGNOSIS",
    "JUMLAH ITEM OBAT",
    "ANTIBIOTIK YA / TIDAK",
    "INJEKSI YA / TIDAK",
    "JUMLAH GENERIK",
    "NAMA OBAT",
    "DOSIS",
    "JUMLAH OBAT",
    "SESUAI PEDOMAN YA / TIDAK",
  ];

  // Matriks rows dimulai langsung dari Header di baris 1 (index 0)
  const rows = [headers];
  const merges = [];

  let currentRow = 1; // Index baris kedua (Baris 2 di Excel)
  let patientNo = 1;

  mappedContent.forEach((pasien) => {
    const receipts =
      pasien.receipt && pasien.receipt.length > 0
        ? pasien.receipt
        : [{ medicineName: "", signa: "", jumlah: "" }];

    const itemCount =
      pasien.receipt && pasien.receipt.length > 0 ? pasien.receipt.length : "0";
    const startRow = currentRow;

    receipts.forEach((rc, index) => {
      rows.push([
        index === 0 ? pasien.date : "", // TGL
        index === 0 ? patientNo : "", // NO
        index === 0 ? pasien.patientName : "", // NAMA
        index === 0 ? `${pasien.patientAge} ${pasien.monthAge}`.trim() : "", // UMUR
        index === 0 ? pasien.ermNumber : "", // NO.REG
        index === 0 ? pasien.medicalPersonnel : "", // DOKTER
        index === 0 ? pasien.diagnoseOne : "", // DIAGNOSIS
        index === 0 ? itemCount : "", // JUMLAH ITEM OBAT
        index === 0 ? (pasien.isAntibiotic ? "1" : "0") : "", // ANTIBIOTIK YA / TIDAK
        index === 0 ? "0" : "", // INJEKSI YA / TIDAK
        index === 0 ? itemCount : "", // JUMLAH GENERIK
        rc.medicineName ? rc.medicineName.trim() : "", // NAMA OBAT
        rc.signa || "", // DOSIS
        rc.jumlah || "", // JUMLAH OBAT
        "", // SESUAI PEDOMAN YA / TIDAK
      ]);
      currentRow++;
    });

    // Merge Cells untuk data pasien (Kolom 0/A sampai Kolom 10/K) jika resep lebih dari 1
    if (receipts.length > 1) {
      const endRow = currentRow - 1;
      for (let col = 0; col <= 10; col++) {
        merges.push({
          s: { r: startRow, c: col },
          e: { r: endRow, c: col },
        });
      }
    }

    patientNo++;
  });

  // Buat sheet dari Array of Arrays (AOA)
  const worksheet = xlsx.utils.aoa_to_sheet(rows);

  // Pasang konfigurasi merge cells
  worksheet["!merges"] = merges;

  // Atur lebar kolom agar tulisan tidak terpotong
  worksheet["!cols"] = [
    { wch: 20 }, // TGL
    { wch: 6 }, // NO
    { wch: 25 }, // NAMA
    { wch: 18 }, // UMUR
    { wch: 12 }, // NO.REG
    { wch: 25 }, // DOKTER
    { wch: 40 }, // DIAGNOSIS
    { wch: 18 }, // JUMLAH ITEM OBAT
    { wch: 22 }, // ANTIBIOTIK YA / TIDAK
    { wch: 20 }, // INJEKSI YA / TIDAK
    { wch: 18 }, // JUMLAH GENERIK
    { wch: 45 }, // NAMA OBAT
    { wch: 12 }, // DOSIS
    { wch: 14 }, // JUMLAH OBAT
    { wch: 25 }, // SESUAI PEDOMAN YA / TIDAK
  ];

  // Simpan ke file .xlsx
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  try {
    xlsx.writeFile(workbook, writePath);

    console.log("File Laporan_Pemeriksaan_Plain.xlsx berhasil dibuat!");
  } catch (error) {
    console.error("Waduuh error Broo / Siss!!:", error);
  }

  // const workSheet = xlsx.utils.json_to_sheet(finalResult);
  // const woorkBook = xlsx.utils.book_new();
  // xlsx.utils.book_append_sheet(woorkBook, workSheet, "Sheet 1");

  // try {
  //   // fs.writeFileSync(writePath, finalResultContentStr);
  //   xlsx.writeFile(woorkBook, writePath);
  //   console.log("content successfully written");
  //   console.log("total data:", finalResult.length);
  // } catch (err) {
  //   console.error("Waduuh error Broo / Siss!!:", err);
  // }
};
