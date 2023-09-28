import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./PaginationNotif.scss";

export default function PaginationNotif({
  pagePathName,
  notifDataSlices,
  notifDataObj,
  activePageIndex,
  setActivePageIndex,
  setNotifDataObj,
}) {
  // How to get query params using useLocation and new URLSearchParams
  const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  };
  const query = useQuery();
  const pageName = useMemo(() => query.get("pageName"), [query]);

  let navigate = useNavigate();

  let notifDataFromSlice = notifDataSlices;
  const notifObjData = notifDataObj;
  const [startIndexPaginationRange, setStartIndexPaginationRange] = useState(0);
  const [endIndexPaginationRange, setEndIndexPaginationRange] = useState(3);

  const changeActivePage = (inputItem) => {
    setActivePageIndex(inputItem.pageName);
  };

  const handleNextOrPreviousPage = (directionType) => {
    if (notifDataObj) {
      const notifObjKeyArr = Object.keys(notifDataObj);
      const nextOrPreviousPageIndex =
        directionType === "next"
          ? notifObjKeyArr.indexOf(activePageIndex) + 1
          : notifObjKeyArr.indexOf(activePageIndex) - 1;
      const nextOrPreviousPageName = notifObjKeyArr[nextOrPreviousPageIndex];
      if (!nextOrPreviousPageName) return;
      setActivePageIndex(nextOrPreviousPageName);
    }
  };

  const displayPageNumberButton = () => {
    if (notifDataObj) {
      const totalDataNotif = notifDataFromSlice.length;
      const notifDataKeyArr = Object.keys(notifDataObj);
      const lastIndexOfDataKeyArr = notifDataKeyArr.length - 1;
      const maxPageNumArr = [];
      const finalEndAlternatif =
        totalDataNotif <= 3
          ? 0
          : totalDataNotif <= 6
          ? 1
          : totalDataNotif <= 9
          ? 2
          : 3;
      let start = startIndexPaginationRange;
      let end =
        totalDataNotif > 12 ? endIndexPaginationRange : finalEndAlternatif;

      if (end > lastIndexOfDataKeyArr) {
        end -= 1;
        start -= 1;
      }

      for (let i = start; i <= end; i++) {
        const objItem = { pageName: notifDataKeyArr[i], index: i };
        maxPageNumArr.push(objItem);
      }

      return (
        <Fragment>
          {maxPageNumArr.map((item, index) => (
            <div
              className={`pagination-button-items ${
                item.pageName === activePageIndex ? "active" : ""
              }`}
              key={index}
              onClick={() => changeActivePage(item)}
            >
              {item.index + 1}
            </div>
          ))}
        </Fragment>
      );
    }
  };

  const objKeyOfNotif = useMemo(() => {
    if (notifDataObj) {
      const objKeyArr = Object.keys(notifDataObj);
      return objKeyArr;
    }
  }, [notifDataObj]);

  const objKeyOfNotifLastIndex = useMemo(
    () => objKeyOfNotif[objKeyOfNotif.length - 1],
    [objKeyOfNotif]
  );

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
    let count = 0;
    let tempArr = [];
    for (let i = 0; i < newSortedData.length; i++) {
      tempArr.push(newSortedData[i]);
      count += 1;
      if (count % maxCardAppearedInOnePage === 0) {
        const pageName = `page${pageNameNumbering}`;
        notifDataMapped[pageName] = tempArr;
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
        <div
          className={`pagination-button-items previous ${
            activePageIndex === "page1" ? "disabled" : ""
          }`}
          onClick={() => handleNextOrPreviousPage("prev")}
        >
          <ArrowBackIosNewIcon
            className={`left-icon ${
              activePageIndex === "page1" ? "disabled" : ""
            }`}
          />
        </div>

        {displayPageNumberButton()}

        <div
          className={`pagination-button-items next ${
            activePageIndex === objKeyOfNotifLastIndex ? "disabled" : ""
          }`}
          onClick={() => handleNextOrPreviousPage("next")}
        >
          <ArrowForwardIosIcon
            className={`right-icon ${
              activePageIndex === objKeyOfNotifLastIndex ? "disabled" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
