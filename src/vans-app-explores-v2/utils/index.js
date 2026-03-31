import { redirect } from "react-router-dom";

export const modifiedToClassCssName = (vanType) => {
  return vanType
    ? vanType
        .split(" ")
        .map((itemVal) => String(itemVal).toLowerCase())
        .join("-")
    : "";
};

export const checkUserLogin = () => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  return !!email && !!password;
};

export const authUserCheck = async (fromPath = "/") => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const isAuth = !!email && !!password;

  if (!isAuth) {
    throw redirect(
      `/login-van-v2?message=You must login first VAN APP V2!&from=${fromPath}`,
    );
  }

  return null;
};

export const nonFetchingDataLoader = async ({ request }) => {
  const pathName = new URL(request.url).pathname;
  return authUserCheck(pathName);
};
