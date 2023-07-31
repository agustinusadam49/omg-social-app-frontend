import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { updateTheMessageById } from "../../apiCalls/messagesApiFetch";
import { useSelector, useDispatch } from "react-redux";
import { setIsGetMessageNotif } from "../../redux/slices/userSlice";
import GlobalImage from "../global-image/GlobalImage";
import "./Friend-List.scss";

export default function FriendList({ user }) {
  const dispatch = useDispatch();
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
        console.log(
          "failed edit message by id message:",
          error.response.data.err.message
        );
      });
  };

  useEffect(() => {
    if (userDataIdFromProp === parseInt(userId)) {
      if (incomingMessageNotifications.length) {
        for (let i = 0; i < incomingMessageNotifications.length; i++) {
          hitApiUpdateMessageById(
            incomingMessageNotifications[i].id,
            {
              receiver_id: incomingMessageNotifications[i].receiver_id,
              message_text: incomingMessageNotifications[i].message_text,
              isRead: true,
              UserId: incomingMessageNotifications[i].UserId,
            }
          );
        }
        dispatch(setIsGetMessageNotif({ isMessageNotif: true }));
      }
    }
  }, [
    userId,
    userDataIdFromProp,
    currentUserIdFromSlice,
    incomingMessageNotifications,
    dispatch,
  ]);

  useEffect(() => {
    const messagesNotReadYet = messages.filter(
      (message) =>
        message.receiver_id === currentUserIdFromSlice &&
        message.isRead === false
    );
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
        <GlobalImage
          widthSize={28}
          heighSize={28}
          imageName={"friend-pict"}
          imageSource={`${user.Profile.avatarUrl}`}
          additionalClassName={["leftbar-friend-img"]}
          isRoundImg={true}
        />
        <div className="leftbar-friend-name">{user.userName}</div>
        {checkActiveBadgeNotifications()}
      </li>
    </Link>
  );
}
