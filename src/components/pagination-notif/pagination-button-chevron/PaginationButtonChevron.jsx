import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import useQueryLocation from "../../../custom-hooks/useQueryLocation";

import "./PaginationButtonChevron.scss";

export default function PaginationButtonChevron({
  notifDataObj,
  objKeyOfNotifLastIndex,
  pagePathName,
  startIndexPaginationRange,
  endIndexPaginationRange,
  setStartIndexPaginationRange,
  setEndIndexPaginationRange,
  direction,
}) {
  let navigate = useNavigate();
  const query = useQueryLocation();
  const activePageNumber = useMemo(() => query.get("pageName") ?? "1", [query]);
  const objKeyOfNotif = Object.keys(notifDataObj);

  const getRequirementOfActivePage = (directionType) => {
    if (directionType === "next")
      return activePageNumber === objKeyOfNotifLastIndex;

    return activePageNumber === "1";
  };

  const handleNextOrPreviousPage = (directionType) => {
    const notifObjKeyArr = Object.keys(notifDataObj);

    const nextOrPreviousPageIndex =
      directionType === "next"
        ? notifObjKeyArr.indexOf(activePageNumber) + 1
        : notifObjKeyArr.indexOf(activePageNumber) - 1;

    const nextOrPreviousPageName = notifObjKeyArr[nextOrPreviousPageIndex];

    if (!nextOrPreviousPageName) return;

    return navigate({
      pathname: pagePathName,
      search: `?pageName=${nextOrPreviousPageName}`,
    });
  };

  // This should be triggered after handleNextOrPreviousPage function is clicked
  useEffect(() => {
    const increaseStartAndEndIdxPaginationRangeByOne = () => {
      setStartIndexPaginationRange((currentNum) => currentNum + 1);
      setEndIndexPaginationRange((currentNum) => currentNum + 1);
    };

    const decreaseStartAndEndIdxPaginationRangeByOne = () => {
      setStartIndexPaginationRange((currentNum) => {
        if (currentNum === 0) return currentNum;
        return currentNum - 1;
      });
      setEndIndexPaginationRange((currentNum) => {
        if (currentNum === 3) return currentNum;
        return currentNum - 1;
      });
    };

    if (objKeyOfNotif.length) {
      const activePageIndex = objKeyOfNotif.indexOf(activePageNumber);
      const lastIndexOfPagination = objKeyOfNotif.length - 1;

      const isActivePageIdxLessThanLastIdxOfPagination =
        activePageIndex < lastIndexOfPagination;
      const isActivePageIdxEqualToEndIdxOfPaginationRange =
        activePageIndex === endIndexPaginationRange;

      const isActivePageIdxEqualToStartIdxOfPaginationRange =
        activePageIndex === startIndexPaginationRange;
      const isActivePageIdxGreaterThanZero = activePageIndex > 0;

      if (
        isActivePageIdxEqualToEndIdxOfPaginationRange &&
        isActivePageIdxLessThanLastIdxOfPagination
      ) {
        return increaseStartAndEndIdxPaginationRangeByOne();
      }

      if (
        isActivePageIdxEqualToStartIdxOfPaginationRange &&
        isActivePageIdxGreaterThanZero
      ) {
        return decreaseStartAndEndIdxPaginationRangeByOne();
      }
    }
  }, [
    activePageNumber,
    objKeyOfNotif,
    endIndexPaginationRange,
    startIndexPaginationRange,
    setStartIndexPaginationRange,
    setEndIndexPaginationRange,
  ]);

  return (
    <div
      className={`pagination-button-items ${direction} ${
        getRequirementOfActivePage(direction) ? "disabled" : ""
      }`}
      onClick={() => handleNextOrPreviousPage(direction)}
    >
      {direction === "previous" ? (
        <ArrowBackIosNewIcon
          className={`left-icon ${
            getRequirementOfActivePage("previous") ? "disabled" : ""
          }`}
        />
      ) : (
        <ArrowForwardIosIcon
          className={`right-icon ${
            getRequirementOfActivePage("next") ? "disabled" : ""
          }`}
        />
      )}
    </div>
  );
}
