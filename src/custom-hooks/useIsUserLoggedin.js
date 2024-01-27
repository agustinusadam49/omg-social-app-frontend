// This custom hooks is not gonna used yet for temporay time
import { useEffect, useState } from "react";
import { accessToken } from "../utils/getLocalStorage";

export const useIsUserLoggedin = () => {
  const access_token = accessToken();
  const [isUserToken, setIsUserToken] = useState(false);

  useEffect(() => {
    if (access_token) {
      setIsUserToken(true);
    } else {
      setIsUserToken(false);
    }
  }, [access_token]);

  return isUserToken;
};
