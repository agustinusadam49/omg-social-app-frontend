import React, { useContext } from "react";
import { notifImageUrl } from "../../utils/notifUrl";
import { notifContext } from "../../context/notifContext";

import "./EmptyStateNotification.scss";

export default function EmptyStateNotification() {
  const { emptyStateType: type } = useContext(notifContext);

  const notificationObjData = {
    follows: {
      wording: "Belum ada Data Follow Notifications",
      iconImageUrl: notifImageUrl.FOLLOW,
    },
    messages: {
      wording: "Belum ada Data Message Notifications",
      iconImageUrl: notifImageUrl.MESSAGE,
    },
    posts: {
      wording: "Belum ada Data Post Notifications",
      iconImageUrl: notifImageUrl.POST,
    },
  };

  return (
    <div className="empty-state-notif">
      <img
        src={notificationObjData[type].iconImageUrl}
        alt="notif-img-icn"
        className="empty-state-notif-img-icon"
      />
      <div className="empty-state-notif-wording">
        {notificationObjData[type].wording}
      </div>
    </div>
  );
}
