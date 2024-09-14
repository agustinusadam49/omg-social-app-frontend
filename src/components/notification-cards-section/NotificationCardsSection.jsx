import React, { Fragment } from "react";
import NotificationCard from "../notification-card/NotificationCard";

export default function NotificationCardsSection({ notifArrByActivePage }) {
  return (
    <Fragment>
      {notifArrByActivePage?.map((notifItem) => (
        <NotificationCard key={notifItem.id} notifications={notifItem} />
      ))}
    </Fragment>
  );
}
