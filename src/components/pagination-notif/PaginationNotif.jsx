import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationButtonItems from "./pagination-button-items/PaginationButtonItems";
import PaginationButtonChevron from "./pagination-button-chevron/PaginationButtonChevron";
import useQueryLocation from "../../custom-hooks/useQueryLocation";

import "./PaginationNotif.scss";

export default function PaginationNotif({
  pagePathName,
  notifDataSlices,
  notifDataObj,
  activePageIndex,
  setActivePageIndex,
  setNotifDataObj,
}) {
  const query = useQueryLocation();
  const pageName = useMemo(() => query.get("pageName"), [query]);

  let navigate = useNavigate();

  const notifDataFromSlice = notifDataSlices;
  const notifObjData = notifDataObj;
  const objKeyOfNotif = Object.keys(notifDataObj);
  const objKeyOfNotifLastIndex = objKeyOfNotif[objKeyOfNotif.length - 1];

  const [startIndexPaginationRange, setStartIndexPaginationRange] = useState(0);
  const [endIndexPaginationRange, setEndIndexPaginationRange] = useState(3);

  const changeActivePage = (inputItem) => {
    setActivePageIndex(inputItem.pageName);
  };

  useEffect(() => {
    const theLength = notifObjData[activePageIndex]?.length;
    let currentArr = [];
    if (theLength) {
      currentArr = notifObjData[activePageIndex];
    }

    if (currentArr.length < 1) {
      setActivePageIndex(objKeyOfNotif[objKeyOfNotif.length - 1]);
    }
  }, [
    notifObjData,
    objKeyOfNotif,
    activePageIndex,
    notifDataFromSlice,
    setActivePageIndex,
  ]);

  useEffect(() => {
    if (activePageIndex) {
      navigate({
        pathname: pagePathName,
        search: `?pageName=${activePageIndex}`,
      });
      return;
    }
  }, [activePageIndex, pagePathName, navigate]);

  useEffect(() => {
    if (pageName) {
      navigate({
        pathname: pagePathName,
        search: `?pageName=${pageName}`,
      });
      setActivePageIndex(pageName);
      return;
    }
  }, [pageName, pagePathName, setActivePageIndex, navigate]);

  useEffect(() => {
    const index = objKeyOfNotif.indexOf(activePageIndex);
    const objKeyLastIndex = objKeyOfNotif.length - 1;
    const isIdxLessThanObjKeyLastIdx = index < objKeyLastIndex;
    if (index > 3) {
      const endIndex = isIdxLessThanObjKeyLastIdx ? index + 1 : index;
      const startIndex = endIndex - 3;
      setStartIndexPaginationRange(startIndex);
      setEndIndexPaginationRange(endIndex);
    }
  }, [activePageIndex, objKeyOfNotif]);

  useEffect(() => {
    if (objKeyOfNotif.length) {
      const indexChecked = objKeyOfNotif.indexOf(activePageIndex);
      const possibilityOne = indexChecked === endIndexPaginationRange;
      const possibilityTwo = indexChecked < objKeyOfNotif.length - 1;
      if (possibilityOne && possibilityTwo) {
        setStartIndexPaginationRange((currentNum) => currentNum + 1);
        setEndIndexPaginationRange((currentNum) => currentNum + 1);
        return;
      }
    }
  }, [
    activePageIndex,
    endIndexPaginationRange,
    startIndexPaginationRange,
    objKeyOfNotif,
  ]);

  useEffect(() => {
    if (objKeyOfNotif.length) {
      const indexChecked = objKeyOfNotif.indexOf(activePageIndex);
      const possibilityOne = indexChecked === startIndexPaginationRange;
      const possibilityTwo = indexChecked > 0;
      if (possibilityOne && possibilityTwo) {
        setStartIndexPaginationRange((currentNum) => currentNum - 1);
        setEndIndexPaginationRange((currentNum) => currentNum - 1);
        return;
      }
    }
  }, [activePageIndex, startIndexPaginationRange, objKeyOfNotif]);

  useEffect(() => {
    const maxCardAppearedInOnePage = 3;
    const newSortedData = notifDataFromSlice
      .filter((item) => item)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let notifDataMapped = {};
    let pageNameNumbering = 1;
    let tempArr = [];

    for (let i = 0; i < newSortedData.length; i++) {
      tempArr.push(newSortedData[i]);
      const count = i + 1

      if (count % maxCardAppearedInOnePage === 0) {
        notifDataMapped[`page${pageNameNumbering}`] = tempArr;
        tempArr = [];
        pageNameNumbering += 1;
      }
    }

    if (tempArr.length > 0) {
      notifDataMapped[`page${pageNameNumbering}`] = tempArr;
    }

    setNotifDataObj(notifDataMapped);

    return () => {
      setNotifDataObj({});
    };
  }, [notifDataFromSlice, setNotifDataObj]);

  return (
    <div className="pagination-container">
      <div className="pagination-wrapper">
        {notifDataObj && (
          <PaginationButtonChevron
            notifDataObj={notifDataObj}
            activePageIndex={activePageIndex}
            objKeyOfNotifLastIndex={objKeyOfNotifLastIndex}
            setActivePageIndex={setActivePageIndex}
            direction="previous"
          />
        )}

        {notifDataObj && (
          <PaginationButtonItems
            notifDataObj={notifDataObj}
            notifDataFromSlice={notifDataFromSlice}
            startIndexPaginationRange={startIndexPaginationRange}
            endIndexPaginationRange={endIndexPaginationRange}
            activePageIndex={activePageIndex}
            changeActivePage={changeActivePage}
          />
        )}

        {notifDataObj && (
          <PaginationButtonChevron
            notifDataObj={notifDataObj}
            activePageIndex={activePageIndex}
            objKeyOfNotifLastIndex={objKeyOfNotifLastIndex}
            setActivePageIndex={setActivePageIndex}
          />
        )}
      </div>
    </div>
  );
}
