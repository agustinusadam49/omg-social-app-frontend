export const modifiedToClassCssName = (vanType) => {
  return vanType
    .split(" ")
    .map((itemVal) => String(itemVal).toLowerCase())
    .join("-");
};
