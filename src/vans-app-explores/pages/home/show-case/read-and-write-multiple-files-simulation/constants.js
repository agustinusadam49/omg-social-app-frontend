export const DIARE_LISTS = [
  {
    disease: "A09",
    description: "Diarrhoea and gastroenteritis of presumed infectious origin",
    isAntibiotic: true,
  },
  {
    disease: "A09.9",
    description: "Gastroenteritis and colitis of unspecified origin",
    isAntibiotic: false,
  },
  {
    disease: "K52",
    description: "Other noninfective gastroenteritis and colitis",
    isAntibiotic: false,
  },
];

export const ISPA_LISTS = [
  {
    disease: "J02",
    description: "Acute pharyngitis",
    isAntibiotic: true,
  },
  {
    disease: "J03",
    description: "Acute tonsillitis",
    isAntibiotic: true,
  },
  {
    disease: "J06",
    description:
      "Acute upper respiratory infections of multiple and unspecified sites",
    isAntibiotic: false,
  },
  {
    disease: "J18.0",
    description: "Bronchopneumonia, unspecified",
    isAntibiotic: true,
  },
  {
    disease: "R05",
    description: "Cough",
    isAntibiotic: true,
  },
  {
    disease: "J00",
    description: "Acute nasopharyngitis [common cold] ",
    isAntibiotic: false,
  },
  {
    disease: "J06.9",
    description: "Acute upper respiratory infection, unspecified",
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
    "ICD-X 1 menjadi icdxOne",
    "Diagnosa 1 menjadi diagnoseOne",
    "Resep menjadi receipt",
  ],
};
