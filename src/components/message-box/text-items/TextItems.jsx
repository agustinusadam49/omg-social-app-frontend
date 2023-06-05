import React from "react";

import { useSelector } from "react-redux";
import { rangeDay } from "../../../utils/rangeDay";

import "./TextItems.scss";

export default function TextItems({ messageItem, paramUserId }) {
  const userIdParam = paramUserId;
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  return (
    <div className="message-data-wrapper">
      <div
        className={`message-items ${
          messageItem.receiverId === userIdParam ? "sender" : "receiver"
        }`}>
        <div
          className={`message-content ${
            messageItem.receiverId === userIdParam ? "sender" : "receiver"
          }`}>
          <span className="username-or-you-in-message-text">
            {messageItem.senderId === currentUserIdFromSlice
              ? "Anda"
              : messageItem.username}
          </span>
          <span className="message-create-date">{rangeDay(messageItem.messageCreateDate)}</span>
          <br />
          {messageItem.textMessage}
          <div
            className={`triangle ${
              messageItem.receiverId === userIdParam ? "right" : "left"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
