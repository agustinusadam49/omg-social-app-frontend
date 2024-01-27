import { redirect } from "react-router-dom";
import { isAuth } from "./isAuth";

export const requiredAuth = async () => {
  const isUserAuth = isAuth();

  if (!isUserAuth) {
    throw redirect("/login?message=You must login first!");
  }

  return null
};
