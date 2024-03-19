import React from "react";

import { useSelector } from "react-redux";
import { rangeDay } from "../../../utils/rangeDay";

import "./TextItems.scss";

export default function TextItems({
  messageItem,
  paramUserId,
  setMessageReadyToReply,
  isShowTriangle,
}) {
  const userIdParam = paramUserId;

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const repliedMessageData = JSON.parse(messageItem.textMessage);

  const getRealMessage = (textObjInString) => {
    const messageTextObj = JSON.parse(textObjInString);
    const messageTextStr = messageTextObj.realTextMessage;
    return messageTextStr;
  };

  const handleClickReply = (messageData) => {
    const transformedMessageReplyData = {
      ...messageData,
      textMessage: getRealMessage(messageData.textMessage),
    };
    setMessageReadyToReply(transformedMessageReplyData);
  };

  return (
    <div className="message-data-wrapper">
      <div
        className={`message-items ${
          messageItem.receiverId === userIdParam ? "sender" : "receiver"
        }`}
      >
        <div
          onClick={() => handleClickReply(messageItem)}
          className={`message-content ${
            messageItem.receiverId === userIdParam ? "sender" : "receiver"
          }`}
        >
          <span className="username-or-you-in-message-text">
            {messageItem.senderId === currentUserIdFromSlice
              ? "Anda"
              : messageItem.username}
          </span>
          <span className="message-create-date">
            {rangeDay(messageItem.messageCreateDate)}
          </span>
          <br />

          {repliedMessageData.messageSourceId && (
            <div className="replied-message-wrapper">
              <div className="replied-message-username">
                {repliedMessageData.senderSourceId === currentUserIdFromSlice
                  ? "Anda"
                  : repliedMessageData.usernameSource}
              </div>
              <div className="replied-message-text">
                {repliedMessageData.textSourceMessage}
              </div>
            </div>
          )}

          {getRealMessage(messageItem.textMessage)}

          {isShowTriangle && (
            <div
              className={`triangle ${
                messageItem.receiverId === userIdParam ? "right" : "left"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
