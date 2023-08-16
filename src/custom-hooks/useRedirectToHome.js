import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accessToken } from "../utils/getLocalStorage";

export const useRedirectToHome = ({ isFromNonAuthPage }) => {
  const access_token = accessToken();
  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true
    const isThereIsAccessToken = !!access_token;
    if (isThereIsAccessToken === true && !isFromNonAuthPage) {
      if (!isSubscribed) return
      navigate("/");
    }

    return () => {
      isSubscribed = false
    }
  }, [access_token, isFromNonAuthPage, navigate]);
};
