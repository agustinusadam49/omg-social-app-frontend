import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import useQueryLocation from "../../../custom-hooks/useQueryLocation";

import "./PaginationButtonChevron.scss";

export default function PaginationButtonChevron({
  notifDataObj,
  objKeyOfNotifLastIndex,
  pagePathName,
  direction = "next",
}) {
  let navigate = useNavigate();
  const query = useQueryLocation();
  const activePageIndex = useMemo(() => query.get("pageName") ?? "1", [query]);

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

    return navigate({
      pathname: pagePathName,
      search: `?pageName=${nextOrPreviousPageName}`,
    });
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
