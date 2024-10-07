export const DIARE_LISTS = [
  {
    disease:
      "Diarrhoea and gastroenteritis of presumed infectious origin (A09)",
    isAntibiotic: true,
  },
  {
    disease: "Gastroenteritis and colitis of unspecified origin (A09.9)",
    isAntibiotic: false,
  },
  {
    disease: "Other noninfective gastroenteritis and colitis (K52)",
    isAntibiotic: false,
  },
];

export const ISPA_LISTS = [
  {
    disease: "Acute pharyngitis (J02)",
    isAntibiotic: true,
  },
  {
    disease: "Acute tonsillitis (J03)",
    isAntibiotic: true,
  },
  {
    disease:
      "Acute upper respiratory infections of multiple and unspecified sites (J06)",
    isAntibiotic: false,
  },
  {
    disease: "Bronchopneumonia, unspecified (J18.0)",
    isAntibiotic: true,
  },
  {
    disease: "Cough (R05)",
    isAntibiotic: true,
  },
  {
    disease: "Acute nasopharyngitis [common cold] (J00)",
    isAntibiotic: false,
  },
  {
    disease: "Acute upper respiratory infection, unspecified (J06.9)",
    isAntibiotic: false,
  },
];

export const diseaseOptions = [
  {
    label: "Diare",
    value: "diare",
  },
  {
    label: "Ispa",
    value: "ispa",
  },
];

export const allWording = {
  featureTitle:
    "Fitur File processing: Laporan Harian Pelayanan Pasien Diare & Ispa",
  h1Warning: "Perhatian",
  paragraphOne:
    "File harus bersih artinya hanya berisi table saja, dan rubah nama kolom sesuai keterangan di Bawah ini:",
  whatToChange: [
    "No. menjadi number",
    "Tanggal menjadi date",
    "Nama Pasien menjadi patientName",
    "No. eRM menjadi ermNumber",
    "Umur Tahun menjadi patientAge",
    "Umur Bulan menjadi monthAge",
    "Dokter / Tenaga Medis menjadi medicalPersonnel",
    "Diagnosa 1 menjadi diagnoseOne",
    "Resep menjadi receipt",
  ],
};
