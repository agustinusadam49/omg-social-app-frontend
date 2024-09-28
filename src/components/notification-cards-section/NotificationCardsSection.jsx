import React, { Fragment, useContext } from "react";
import NotificationCard from "../notification-card/NotificationCard";
import { notifContext } from "../../context/notifContext";

export default function NotificationCardsSection() {
  const { notifArrByActivePage } = useContext(notifContext);

  return (
    <Fragment>
      {notifArrByActivePage?.map((notifItem) => (
        <NotificationCard key={notifItem.id} notifications={notifItem} />
      ))}
    </Fragment>
  );
}
