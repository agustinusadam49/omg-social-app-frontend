export const mappedPageObjUtil = ({ notifData, maxCardAppearedInOnePage }) => {
  const newSortedData = notifData
    .filter((item) => item)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let notifDataMapped = {};
  let pageNameNumbering = 1;
  let tempArr = [];

  for (let i = 0; i < newSortedData.length; i++) {
    const count = i + 1;

    tempArr.push(newSortedData[i]);

    if (count % maxCardAppearedInOnePage === 0) {
      notifDataMapped[`${pageNameNumbering}`] = tempArr;
      tempArr = [];
      pageNameNumbering += 1;
    }
  }

  if (tempArr.length > 0) {
    notifDataMapped[`${pageNameNumbering}`] = tempArr;
  }

  return notifDataMapped;
};
