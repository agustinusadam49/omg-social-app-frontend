export const hbdChecker = (userBirthDate) => {
  const thisUserBirhtdate = new Date(userBirthDate);
  const userHBD = thisUserBirhtdate.getDate();
  const bulanUltahSolikin = thisUserBirhtdate.getMonth();
  const currentDate = new Date();
  const tanggalHariIni = currentDate.getDate();
  const bulanIni = currentDate.getMonth();

  let isMonthValid = false;
  let isDateValid = false;

  if (tanggalHariIni === userHBD) {
    isDateValid = true;
  }

  if (bulanIni === bulanUltahSolikin) {
    isMonthValid = true;
  }

  return isMonthValid && isDateValid;
};
