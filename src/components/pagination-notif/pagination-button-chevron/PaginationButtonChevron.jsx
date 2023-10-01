import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import "./PaginationButtonChevron.scss";

export default function PaginationButtonChevron({
  notifDataObj,
  activePageIndex,
  objKeyOfNotifLastIndex,
  setActivePageIndex,
  direction = "next",
}) {
  const getRequirementOfActivePage = (directionType) => {
    if (directionType === "next") {
      return activePageIndex === objKeyOfNotifLastIndex;
    }

    return activePageIndex === "page1";
  };

  const handleNextOrPreviousPage = (directionType) => {
    const notifObjKeyArr = Object.keys(notifDataObj);
    const nextOrPreviousPageIndex =
      directionType === "next"
        ? notifObjKeyArr.indexOf(activePageIndex) + 1
        : notifObjKeyArr.indexOf(activePageIndex) - 1;
    const nextOrPreviousPageName = notifObjKeyArr[nextOrPreviousPageIndex];
    if (!nextOrPreviousPageName) return;
    setActivePageIndex(nextOrPreviousPageName);
  };

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
