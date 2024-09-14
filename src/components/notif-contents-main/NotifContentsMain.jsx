import React from "react";
import NotificationCardsSection from "../notification-cards-section/NotificationCardsSection";
import EmptyStateNotification from "../empty-state-notification/EmptyStateNotification";
import GlobalButton from "../button/GlobalButton";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import PaginationNotif from "../pagination-notif/PaginationNotif";

import "./NotifContentsMain.scss";

export default function NotifContentsMain({
  staticFilteredData,
  notifArrByActivePage,
  notifDataFromSlice,
  totalAllIsRead,
  isNotifLoadingState,
  notifDataObj,
  notifTitle,
  pagePathName,
  changeButton,
}) {
  return (
    <div className="notif-contents-main">
      <div className="notif-title">{notifTitle}</div>
      <div className="notif-card-wrapper">
        <div className="notif-card-inner-wrapper">
          {!!staticFilteredData.length ? (
            <NotificationCardsSection
              notifArrByActivePage={notifArrByActivePage}
            />
          ) : (
            <EmptyStateNotification type={"follows"} />
          )}
        </div>

        {!!notifDataFromSlice.length && (
          <GlobalButton
            classStyleName={`notif-mark-all-notif-button ${
              totalAllIsRead ? "active" : "not-active"
            }`}
            buttonLabel={
              totalAllIsRead
                ? "Tandai semua sebagai dibaca"
                : "Semua notif telah dibaca"
            }
            onClick={() => changeButton()}
            loading={isNotifLoadingState}
            isDisabled={isNotifLoadingState}
            renderLabel={({ label, isLoading }) => {
              return !isLoading ? (
                <div>{label}</div>
              ) : (
                <RoundedLoader
                  baseColor="gray"
                  secondaryColor="white"
                  size={17}
                />
              );
            }}
          />
        )}
      </div>

      {!!notifDataFromSlice.length && (
        <PaginationNotif
          pagePathName={pagePathName}
          notifDataSlices={notifDataFromSlice}
          notifDataObj={notifDataObj}
        />
      )}
    </div>
  );
}
