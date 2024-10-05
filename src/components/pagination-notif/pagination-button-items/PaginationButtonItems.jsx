import React, { Fragment, useMemo, useContext } from "react";
import { notifContext } from "../../../context/notifContext";

import "./PaginationButtonItems.scss";

export default function PaginationButtonItems({
  startIndexPaginationRange,
  endIndexPaginationRange,
  activePageIndex,
  changeActivePage,
}) {
  const { notifDataFromSlice, notifDataObj } = useContext(notifContext);

  const totalDataNotif = notifDataFromSlice.length;
  const notifDataKeyArr = Object.keys(notifDataObj);
  const lastIndexOfDataKeyArr = notifDataKeyArr.length - 1;

  const maxPageNumArr = useMemo(() => {
    const resultArr = [];

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
      resultArr.push(objItem);
    }

    return resultArr;
  }, [
    totalDataNotif,
    notifDataKeyArr,
    lastIndexOfDataKeyArr,
    startIndexPaginationRange,
    endIndexPaginationRange,
  ]);

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
