export const modifiedToClassCssName = (vanType) => {
  return vanType
    ? vanType

        .split(" ")
        .map((itemVal) => String(itemVal).toLowerCase())
        .join("-")
    : "";
};
