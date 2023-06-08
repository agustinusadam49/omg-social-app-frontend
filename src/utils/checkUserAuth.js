import { useEffect } from "react";
import { setIsAuthUser } from "../redux/slices/userSlice";

export const useCheckUserAuth = ({
  isUserLoggedin,
  access_token,
  dispatch,
}) => {
  useEffect(() => {
    if (access_token) {
      dispatch(setIsAuthUser({ isAuth: true }));
    } else {
      dispatch(setIsAuthUser({ isAuth: false }));
    }
  }, [isUserLoggedin, access_token, dispatch]);
};
