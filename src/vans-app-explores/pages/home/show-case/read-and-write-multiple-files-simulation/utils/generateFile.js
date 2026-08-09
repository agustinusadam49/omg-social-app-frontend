import * as xlsx from "xlsx";

import {
  readFileAndMergedData,
  formattedReceipt,
} from "./helpersForGenerateFile/helpers.js";

export const generateContentFileOps = async ({
  readPath,
  writePath,
  sheetName,
  diseaseType,
}) => {
  const contentSortedByDate = await readFileAndMergedData(
    readPath,
    sheetName,
    diseaseType,
  );

  const mappedContent = contentSortedByDate.map((item) => ({
    ...item,
    receipt: formattedReceipt(item.receipt),
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
        index === 0 ? pasien.patientAge.trim() : "", // UMUR
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
};
