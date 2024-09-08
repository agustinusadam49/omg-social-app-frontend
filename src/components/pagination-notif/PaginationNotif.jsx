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
}) {
  let navigate = useNavigate();
  const query = useQueryLocation();

  const notifDataFromSlice = notifDataSlices;
  const notifObjData = notifDataObj;
  const objKeyOfNotif = Object.keys(notifDataObj);
  const objKeyOfNotifLastIndex = objKeyOfNotif[objKeyOfNotif.length - 1];

  const pageName = useMemo(() => query.get("pageName"), [query]);

  const [startIndexPaginationRange, setStartIndexPaginationRange] = useState(0);
  const [endIndexPaginationRange, setEndIndexPaginationRange] = useState(3);

  const changeActivePage = (inputItem) => {
    const pageNum = inputItem.pageName;

    return navigate({
      pathname: pagePathName,
      search: `?pageName=${pageNum}`,
    });
  };

  useEffect(() => {
    const index = objKeyOfNotif.indexOf(pageName);
    const objKeyLastIndex = objKeyOfNotif.length - 1;
    const isIdxLessThanObjKeyLastIdx = index < objKeyLastIndex;
    if (index > 3) {
      const endIndex = isIdxLessThanObjKeyLastIdx ? index + 1 : index;
      const startIndex = endIndex - 3;
      setStartIndexPaginationRange(startIndex);
      setEndIndexPaginationRange(endIndex);
    }
  }, [pageName, objKeyOfNotif]);

  useEffect(() => {
    if (objKeyOfNotif.length) {
      const indexChecked = objKeyOfNotif.indexOf(pageName);
      const possibilityOne = indexChecked === endIndexPaginationRange;
      const possibilityTwo = indexChecked < objKeyOfNotif.length - 1;
      if (possibilityOne && possibilityTwo) {
        setStartIndexPaginationRange((currentNum) => currentNum + 1);
        setEndIndexPaginationRange((currentNum) => currentNum + 1);
        return;
      }
    }
  }, [
    pageName,
    endIndexPaginationRange,
    startIndexPaginationRange,
    objKeyOfNotif,
  ]);

  useEffect(() => {
    if (objKeyOfNotif.length) {
      const indexChecked = objKeyOfNotif.indexOf(pageName);
      const possibilityOne = indexChecked === startIndexPaginationRange;
      const possibilityTwo = indexChecked > 0;
      if (possibilityOne && possibilityTwo) {
        setStartIndexPaginationRange((currentNum) => currentNum - 1);
        setEndIndexPaginationRange((currentNum) => currentNum - 1);
        return;
      }
    }
  }, [pageName, startIndexPaginationRange, objKeyOfNotif]);

  useEffect(() => {
    if (!notifObjData[pageName]) {
      return navigate({
        pathname: pagePathName,
        search: `?pageName=${objKeyOfNotifLastIndex}`,
      });
    }
  }, [navigate, notifObjData, objKeyOfNotifLastIndex, pageName, pagePathName]);

  useEffect(() => {
    return navigate({
      pathname: pagePathName,
      search: `?pageName=${pageName ?? "1"}`,
    });
  }, [pageName, pagePathName, navigate]);

  return (
    <div className="pagination-container">
      <div className="pagination-wrapper">
        {notifDataObj && (
          <PaginationButtonChevron
            activePageIndex={pageName}
            objKeyOfNotifLastIndex={objKeyOfNotifLastIndex}
            notifDataObj={notifDataObj}
            pagePathName={pagePathName}
            direction="previous"
          />
        )}

        {notifDataObj && (
          <PaginationButtonItems
            notifDataObj={notifDataObj}
            notifDataFromSlice={notifDataFromSlice}
            startIndexPaginationRange={startIndexPaginationRange}
            endIndexPaginationRange={endIndexPaginationRange}
            activePageIndex={pageName}
            changeActivePage={changeActivePage}
          />
        )}

        {notifDataObj && (
          <PaginationButtonChevron
            activePageIndex={pageName}
            objKeyOfNotifLastIndex={objKeyOfNotifLastIndex}
            notifDataObj={notifDataObj}
            pagePathName={pagePathName}
          />
        )}
      </div>
    </div>
  );
}
