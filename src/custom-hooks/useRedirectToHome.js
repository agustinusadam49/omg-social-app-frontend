import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accessToken } from "../utils/getLocalStorage";

export const useRedirectToHome = ({ isFromNonAuthPage }) => {
  const access_token = accessToken();
  const navigate = useNavigate();

  useEffect(() => {
    const isThereIsAccessToken = !!access_token;
    if (isThereIsAccessToken === true && !isFromNonAuthPage) {
      navigate("/");
    }
  }, [access_token, isFromNonAuthPage, navigate]);
};
