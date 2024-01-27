import { useState, useEffect } from "react";

export const useFetchData = (callback) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const onValidate = () => isActive;

    callback(onValidate, setLoading, setErrorMessage);

    return () => {
      isActive = false;
      setLoading(false);
    };
  }, [callback]);

  return {
    loading,
    errorMessage,
  };
};
