import { redirect } from "react-router-dom";
import { isAuth } from "./isAuth";

export const pageGuard = async () => {
  const isUserAuth = isAuth();

  if (isUserAuth) {
    throw redirect("/");
  }

  return null;
};
