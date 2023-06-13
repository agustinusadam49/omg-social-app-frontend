const rangeDay = (date) => {
  const postCreatedAtInMiliseconds = new Date(date).getTime();
  const todayInMiliseconds = new Date().getTime();
  const milisecondsInOneDay = 24 * 60 * 60 * 1000;
  const secondInOneDay = 24 * 60 * 60;
  const selisihWaktuDalamHari = Math.round(
    Math.abs(
      (todayInMiliseconds - postCreatedAtInMiliseconds) / milisecondsInOneDay
    )
  );

  const selisihWaktuDalamMenit = Math.round(
    Math.abs((todayInMiliseconds - postCreatedAtInMiliseconds) / secondInOneDay)
  );

  if (selisihWaktuDalamHari > 365) {
    return `${Math.floor(selisihWaktuDalamHari / 365)} tahun yang lalu.`;
  } else if (selisihWaktuDalamHari > 31) {
    return `${Math.floor(selisihWaktuDalamHari / 30)} bulan yang lalu.`;
  } else if (selisihWaktuDalamHari > 7) {
    return `${Math.floor(selisihWaktuDalamHari / 7)} minggu yang lalu.`;
  } else if (selisihWaktuDalamHari > 0) {
    return `${selisihWaktuDalamHari} hari yang lalu.`;
  } else {
    if (selisihWaktuDalamMenit > 60) {
      return `${Math.floor(selisihWaktuDalamMenit / 60)} jam yang lalu.`;
    } else if (selisihWaktuDalamMenit > 0) {
      return `${selisihWaktuDalamMenit} menit yang lalu.`;
    } else {
      return "baru saja";
    }
  }
};

module.exports = {
  rangeDay,
};
