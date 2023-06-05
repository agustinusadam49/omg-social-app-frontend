import { useState, useEffect, useMemo } from "react";

export const useScreenWidth = (widthType) => {
  const [windowWidthSize, setWindowWidthSize] = useState([window.innerWidth]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidthSize([window.innerWidth]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const result = useMemo(() => {
    if (widthType === "lg") {
        return windowWidthSize[0] >= 1024
    } else {
        return windowWidthSize[0] < 1024
    }
  }, [widthType, windowWidthSize])

  return result;
};
