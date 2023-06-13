import { useState } from "react";
import { useAutomaticCloseMessageToast } from "./automaticCloseMessageToast";

export const useToast = () => {
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isSuccessMessageActive, setIsSuccessMessageActive] = useState(false);
  const [isErrorMessageActive, setIsErrorMessageActive] = useState(false);

  const toastObj = {
    success: (message) => {
      setMessageSuccess(message);
      setIsSuccessMessageActive(true);
    },
    error: (message) => {
      setMessageError(message);
      setIsErrorMessageActive(true);
    },
    closeSuccess: () => {
      setIsSuccessMessageActive(false);
    },
    closeError: () => {
      setIsErrorMessageActive(false);
    },
    successMessage: messageSuccess,
    isActiveSuccess: isSuccessMessageActive,
    errorMessage: messageError,
    isActiveError: isErrorMessageActive,
  };

  useAutomaticCloseMessageToast({
    status: isSuccessMessageActive,
    setStatus: setIsSuccessMessageActive,
    interval: 5000,
  });

  useAutomaticCloseMessageToast({
    status: isErrorMessageActive,
    setStatus: setIsErrorMessageActive,
    interval: 5000,
  });

  return toastObj;
};
