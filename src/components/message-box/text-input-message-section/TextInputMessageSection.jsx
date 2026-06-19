import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import RoundedLoader from "../../rounded-loader/RoundedLoader";

import "./TextInputMessageSection.scss";

export default function TextInputMessageSection({
  isThisUserVisitedMyProfile,
  whoIsWriting,
  messageReadyToReply,
  setMessageReadyToReply,
  doCreateNewMessageWithEnter,
  messageText,
  handleTypingMessage,
  loadingState,
    sendNewMessage,
  setIsTyping,
}) {
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture,
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);

  useEffect(() => {
    if (messageText) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
      return;
    }

    const timerToStopType = setTimeout(() => {
      setIsTyping(false);
    }, 800);

    return () => {
      clearTimeout(timerToStopType);
    };
  }, [messageText, setIsTyping]);

  return (
    <div className="send-message-container">
      {isThisUserVisitedMyProfile ? (
        <div className="who-is-writting">{whoIsWriting}</div>
      ) : (
        <div className="who-is-writting" />
      )}

      {messageReadyToReply && (
        <div className="message-ready-to-reply">
          <div className="user-name-and-text-wrapper">
            <div className="user-message-name">
              {messageReadyToReply.senderId === currentUserIdFromSlice
                ? "Anda"
                : messageReadyToReply.username}
            </div>

            <div className="message-content">
              {messageReadyToReply.textMessage}
            </div>
          </div>

          <div className="close-message-ready-to-reply">
            <div
              className="close-button-ready-to-reply"
              onClick={() => setMessageReadyToReply(null)}
            >
              X
            </div>
          </div>
        </div>
      )}

      <div
        className="send-message-wrapper"
        onKeyPress={doCreateNewMessageWithEnter}
      >
        <Link
          to={`/profile/${currentUserNameFromSlice}/user-id/${currentUserIdFromSlice}`}
        >
          <img
            src={currentUserAvatarFromSlice}
            alt="user-avatar"
            className="messages-current-user-avatar"
          />
        </Link>

        <input
          placeholder="Type your message here ..."
          className="messages-input"
          type="text"
          value={messageText}
          onChange={(e) => handleTypingMessage(e.target.value)}
        />

        {!loadingState.status ? (
          <button
            className={
              messageText !== ""
                ? "messages-button-send"
                : "messages-button-send-disabled"
            }
            disabled={!messageText}
            onClick={sendNewMessage}
          >
            Send
          </button>
        ) : (
          <button className="messages-button-send">
            <RoundedLoader
              size={14}
              baseColor="rgb(251, 226, 226)"
              secondaryColor="green"
            />
          </button>
        )}
      </div>
    </div>
  );
}
