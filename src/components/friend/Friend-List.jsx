import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { updateTheMessageById } from "../../apiCalls/messagesApiFetch";
import { useSelector, useDispatch } from "react-redux";
import { setSnapUserLogout } from "../../redux/slices/userSlice";
import { accessToken } from "../../utils/getLocalStorage";
import "./Friend-List.scss";

export default function FriendList({ user }) {
  const dispatch = useDispatch();
  const access_token = accessToken();
  const { userId } = useParams();
  const userDataIdFromProp = user.id;
  const messages = user.Messages;
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const [incomingMessageNotifications, setIncomingMessageNotifications] = useState([]);

  const checkActiveBadgeNotifications = () => {
    if (incomingMessageNotifications.length) {
      return (
        <span className="message-badge-notification">
          {incomingMessageNotifications.length}
        </span>
      );
    }
  };

  const hitApiUpdateMessageById = (userAccessToken, messageId, payloadBody) => {
    updateTheMessageById(userAccessToken, messageId, payloadBody)
      .then(() => {})
      .catch((error) => {
        console.log("failed edit message by id message:", error.response.data.err.message);
      });
  };

  useEffect(() => {
    if (userDataIdFromProp === parseInt(userId) && access_token) {
      if (incomingMessageNotifications.length) {
        for (let i = 0; i < incomingMessageNotifications.length; i++) {
          hitApiUpdateMessageById(
            access_token,
            incomingMessageNotifications[i].id,
            {
              receiver_id: incomingMessageNotifications[i].receiver_id,
              message_text: incomingMessageNotifications[i].message_text,
              isRead: true,
              UserId: incomingMessageNotifications[i].UserId,
            }
          );
        }
        dispatch(setSnapUserLogout({ isUserLogout: true }))
      }
    }
  }, [
    userId,
    userDataIdFromProp,
    currentUserIdFromSlice,
    incomingMessageNotifications,
    access_token,
    dispatch
  ]);

  useEffect(() => {
    const messagesNotReadYet = messages.filter(
      (message) =>
        message.receiver_id === currentUserIdFromSlice &&
        message.isRead === false
    )
    setIncomingMessageNotifications(messagesNotReadYet);
  }, [messages, currentUserIdFromSlice]);

  return (
    <Link
      to={`/profile/${user.userName}/user-id/${user.id}`}
      style={{ textDecoration: "none", color: "black" }}
    >
      <li
        className={`leftbar-friend ${
          user.id === parseInt(userId)
            ? "bg-color-grey"
            : "bg-color-transparent"
        }`}
      >
        <img
          src={`${user.Profile.avatarUrl}`}
          alt="friend-pict"
          className="leftbar-friend-img"
        />
        <span className="leftbar-friend-name">{user.userName}</span>
        {checkActiveBadgeNotifications()}
      </li>
    </Link>
  );
}
