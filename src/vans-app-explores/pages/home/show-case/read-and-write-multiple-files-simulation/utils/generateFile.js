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
    // "NO.REG", // DINONAKTIFKAN
    // "DOKTER", // DINONAKTIFKAN
    "DIAGNOSIS",
    "JUMLAH ITEM OBAT",
    "",
    "ANTIBIOTIK YA / TIDAK",
    "",
    "INJEKSI YA / TIDAK",
    "",
    "JUMLAH GENERIK",
    "",
    "NAMA OBAT",
    "DOSIS",
    "JUMLAH OBAT",
    "SESUAI PEDOMAN YA / TIDAK",
  ];

  // Matriks rows dimulai langsung dari Header di baris 1 (index 0)
  const rows = [
    ["FORMULIR MONITORING INDIKATOR PERESEPAN"],
    [],
    [
      "PUSKESMAS",
      ": TANAH TINGGI",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "BULAN",
      ": JULI",
    ],
    [
      "KOTA",
      ": TANGERANG",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "TAHUN",
      ": 2026",
    ],
    ["PROPINSI", ": BANTEN"],
    [],
    headers,
  ];
  const merges = [];

  let currentRow = rows.length;
  console.log("currentRow:", currentRow);
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
        // index === 0 ? pasien.ermNumber : "", // NO.REG // DINONAKTIFKAN
        // index === 0 ? pasien.medicalPersonnel : "", // DOKTER // DINONAKTIFKAN
        index === 0 ? pasien.diagnoseOne : "", // DIAGNOSIS
        index === 0 ? itemCount : "", // JUMLAH ITEM OBAT
        "",
        index === 0 ? (pasien.isAntibiotic ? "1" : "0") : "", // ANTIBIOTIK YA / TIDAK
        "",
        index === 0 ? "0" : "", // INJEKSI YA / TIDAK
        "",
        index === 0 ? itemCount : "", // JUMLAH GENERIK
        "",
        rc.medicineName ? rc.medicineName.trim() : "", // NAMA OBAT
        rc.signa || "", // DOSIS
        rc.jumlah || "", // JUMLAH OBAT
        "", // SESUAI PEDOMAN YA / TIDAK
      ]);
      currentRow++;
    });

    // Merge Cells untuk data pasien (Kolom 0/A sampai Kolom 12/M) jika resep lebih dari 1
    const endRow = currentRow - 1;
    if (receipts.length > 1) {
      for (let col = 0; col <= 4; col++) {
        merges.push({
          s: { r: startRow, c: col },
          e: { r: endRow, c: col },
        });
      }
    }

    merges.push({
      s: { r: startRow, c: 5 },
      e: { r: endRow, c: 6 },
    });

    merges.push({
      s: { r: startRow, c: 7 },
      e: { r: endRow, c: 8 },
    });

    merges.push({
      s: { r: startRow, c: 9 },
      e: { r: endRow, c: 10 },
    });

    merges.push({
      s: { r: startRow, c: 11 },
      e: { r: endRow, c: 12 },
    });

    patientNo++;
  });

  merges.push({
    s: { r: 0, c: 0 },
    e: { r: 0, c: headers.length - 1 },
  });

  merges.push({
    s: { r: 6, c: 5 },
    e: { r: 6, c: 6 },
  });

  merges.push({
    s: { r: 6, c: 7 },
    e: { r: 6, c: 8 },
  });

  merges.push({
    s: { r: 6, c: 9 },
    e: { r: 6, c: 10 },
  });

  merges.push({
    s: { r: 6, c: 11 },
    e: { r: 6, c: 12 },
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
    // { wch: 12 }, // NO.REG // DINONAKTIFKAN
    // { wch: 25 }, // DOKTER // DINONAKTIFKAN
    { wch: 40 }, // DIAGNOSIS
    { wch: 5 }, // JUMLAH ITEM OBAT
    { wch: 5 },
    { wch: 5 }, // ANTIBIOTIK YA / TIDAK
    { wch: 5 },
    { wch: 5 }, // INJEKSI YA / TIDAK
    { wch: 5 },
    { wch: 5 }, // JUMLAH GENERIK
    { wch: 5 },
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
