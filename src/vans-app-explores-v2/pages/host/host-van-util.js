const getPercentage = (ratingArg, dummyVanReviews) => {
  const amountOfPeople = dummyVanReviews.length;
  const filteredDataByRating = dummyVanReviews.filter(
    (item) => item.rating === ratingArg,
  );

  const ratingArgAmount = filteredDataByRating.length;
  const percentage = Math.round((ratingArgAmount / amountOfPeople) * 100);
  return percentage;
};

export const getPercentageDataArr = (reviewObjArr) => {
  const ratings = [1, 2, 3, 4, 5];

  return ratings.map((rating) => ({
    rate: rating,
    percentageValue: getPercentage(rating, reviewObjArr),
  }));
};

export const getOverallRating = (dataArr) => {
  const ratingMap = dataArr.reduce((newObj, currentData) => {
    if (newObj[currentData.rating]) {
      newObj[currentData.rating] += 1;
    } else {
      newObj[currentData.rating] = 1;
    }

    return newObj;
  }, {});

  const totalScore = Object.keys(ratingMap).reduce((acc, rating) => {
    return acc + rating * ratingMap[rating];
  }, 0);

  return (totalScore / dataArr.length).toFixed(1);
};
