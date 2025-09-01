export const getStatus = (statusFromResponse, statusOptionEnum) => {
  return statusOptionEnum[statusFromResponse]
    .split("_")
    .map((status) => status[0] + status.substring(1).toLowerCase())
    .join(" ");
};
