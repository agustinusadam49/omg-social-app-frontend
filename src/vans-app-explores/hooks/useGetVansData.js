import { useState, useEffect } from "react";
import { dummyVansArr } from "../../dummyData";
import {
  mappedFromArrayToObj,
  orderVansByType,
} from "../van-utils/vansDataControls";

export const useGetVansData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const promiseToGetVans = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!!dummyVansArr.length) {
          const vanObjMapped = mappedFromArrayToObj(dummyVansArr);
          const orderedVansArray = orderVansByType(vanObjMapped);
          resolve(orderedVansArray);
        } else {
          reject("Tidak ada data vans!");
        }
      }, 1000);
    });

    let isActive = true;

    const hitGetVansPromise = async () => {
      setLoading(true);
      try {
        const responses = await promiseToGetVans;
        if (!isActive) return;
        setData(responses);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    hitGetVansPromise()

    return () => {
      isActive = false;
      setLoading(false);
    };
  }, []);

  return {
    data,
    loading,
    errorMessage,
  };
};
