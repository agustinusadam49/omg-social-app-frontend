const formatBirthDate = (date) => {
  const userBirthDateData = new Date(date);
  const tanggal = userBirthDateData.getDate();
  const bulan = userBirthDateData.getMonth() + 1;
  const tahun = userBirthDateData.getFullYear();

  let namaBulanBentukIndonesia = "";
  if (bulan === 1) {
    namaBulanBentukIndonesia = "Januari";
  } else if (bulan === 2) {
    namaBulanBentukIndonesia = "Februari";
  } else if (bulan === 3) {
    namaBulanBentukIndonesia = "Maret";
  } else if (bulan === 4) {
    namaBulanBentukIndonesia = "April";
  } else if (bulan === 5) {
    namaBulanBentukIndonesia = "Mei";
  } else if (bulan === 6) {
    namaBulanBentukIndonesia = "Juni";
  } else if (bulan === 7) {
    namaBulanBentukIndonesia = "Juli";
  } else if (bulan === 8) {
    namaBulanBentukIndonesia = "Agustus";
  } else if (bulan === 9) {
    namaBulanBentukIndonesia = "September";
  } else if (bulan === 10) {
    namaBulanBentukIndonesia = "Oktober";
  } else if (bulan === 11) {
    namaBulanBentukIndonesia = "November";
  } else if (bulan === 12) {
    namaBulanBentukIndonesia = "Desember";
  }

  const indonesianDate = `${tanggal} ${namaBulanBentukIndonesia} ${tahun}`;
  return indonesianDate;
};

module.exports = {
  formatBirthDate,
};
