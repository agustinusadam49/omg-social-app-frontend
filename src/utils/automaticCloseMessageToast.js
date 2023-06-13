import { useEffect } from "react";

export const useAutomaticCloseMessageToast = ({
  status,
  setStatus,
  interval,
}) => {
  useEffect(() => {
    const delayDisappearedStatusMessage =
      status === true &&
      setInterval(() => {
        setStatus(false);
      }, interval);

    return () => {
      clearInterval(delayDisappearedStatusMessage);
    };
  }, [status, setStatus, interval]);
};
