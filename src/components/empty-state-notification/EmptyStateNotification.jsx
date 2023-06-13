import React from "react";
import { notifImageUrl } from "../../utils/notifUrl";
import "./EmptyStateNotification.scss";

export default function EmptyStateNotification({ type }) {
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
        <div className="empty-state-notif-wording">{notificationObjData[type].wording}</div>
    </div>
  );
}
