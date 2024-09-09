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

    if (index > 3) {
      const objKeyLastIndex = objKeyOfNotif.length - 1;
      const isIdxLessThanObjKeyLastIdx = index < objKeyLastIndex;
      const endIndex = isIdxLessThanObjKeyLastIdx ? index + 1 : index;
      const startIndex = endIndex - 3;
      setStartIndexPaginationRange(startIndex);
      setEndIndexPaginationRange(endIndex);
    }
  }, [pageName, objKeyOfNotif]);

  useEffect(() => {
    if (objKeyOfNotif.length) {
      const activePageIndex = objKeyOfNotif.indexOf(pageName);
      const lastIndexOfPagination = objKeyOfNotif.length - 1;

      const isActivePageIdxLessThanLastIdxOfPagination =
        activePageIndex < lastIndexOfPagination;
      const isActivePageIdxEqualToEndIdxOfPaginationRange =
        activePageIndex === endIndexPaginationRange;

      if (
        isActivePageIdxEqualToEndIdxOfPaginationRange &&
        isActivePageIdxLessThanLastIdxOfPagination
      ) {
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
      const activePageIndex = objKeyOfNotif.indexOf(pageName);

      const isActivePageIdxEqualToStartIdxOfPaginationRange =
        activePageIndex === startIndexPaginationRange;
      const isActivePageIdxGreaterThanZero = activePageIndex > 0;

      if (
        isActivePageIdxEqualToStartIdxOfPaginationRange &&
        isActivePageIdxGreaterThanZero
      ) {
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
