import React, { useState, useEffect, memo, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TextItems from "./text-items/TextItems";
import {
  getAllMessagesData,
  createNewMessageData,
} from "../../apiCalls/messagesApiFetch";
import { setSnapUserLogout } from "../../redux/slices/userSlice";
import { updateTheMessageById } from "../../apiCalls/messagesApiFetch";
import { accessToken } from "../../utils/getLocalStorage";
import { io } from "socket.io-client";
import "./MessageBox.scss";

const MessageBox = ({ paramUserId }) => {
  const access_token = accessToken();

  const dispatch = useDispatch();

  const socket = useRef(null);
  const scrollRef = useRef(null);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserAvatarFromSlice = useSelector((state) => state.user.userAvatarPicture);

  const [usersOnline, setUsersOnline] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [mappedMessages, setMappedMessages] = useState(allMessages || []);
  const [whoIsWriting, setWhoIsWriting] = useState("");
  const [isThisUserVisitedMyProfile, setIsThisUserVisitedMyProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const emitSocket = (emitName, payload) => {
    socket.current.emit(emitName, payload);
  }

  const displayWhoIsWritting = () => {
    if (isThisUserVisitedMyProfile === true) {
      return <div className="who-is-writting">{whoIsWriting}</div>;
    } else {
      return <div className="who-is-writting" />;
    }
  };

  const handleTypingMessage = (value) => {
    setMessageText(value);
  };

  const sendNewMessage = () => {
    hitApiCreateNewMessage(access_token);
  };

  const doCreateNewMessageWithEnter = (event) => {
    if (event.key === "Enter" && messageText !== "") {
      hitApiCreateNewMessage(access_token);
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

  const hitApiCreateNewMessage = (userAccessToken) => {
    const payloadToCreateMessage = {
      receiver_id: paramUserId,
      message_text: messageText,
      senderName: currentUserNameFromSlice,
    };

    createNewMessageData(userAccessToken, payloadToCreateMessage)
      .then((newMessageResult) => {
        const successCreateNewMessage = newMessageResult.data.success;
        if (successCreateNewMessage === true) {
          setMessageText("");
          const newMessageDataDB = newMessageResult.data.newMessage;
          const createDate = newMessageResult.data.newMessage.createdAt;
          const createObjNewMessages = {
            id: newMessageDataDB.id,
            receiverId: payloadToCreateMessage.receiver_id,
            senderId: currentUserIdFromSlice,
            username: payloadToCreateMessage.senderName,
            textMessage: payloadToCreateMessage.message_text,
            messageCreateDate: createDate,
          };

          if (isThisUserVisitedMyProfile === true) {
            hitApiUpdateMessageById(access_token, newMessageDataDB.id, {
              receiver_id: newMessageDataDB.receiver_id,
              message_text: newMessageDataDB.message_text,
              isRead: true,
              UserId: newMessageDataDB.UserId,
            });
            emitSocket("sendPrivateMessage", createObjNewMessages)
            emitSocket("sendNotif", createObjNewMessages)
          } else {
            const findUserReceiverId = usersOnline.filter((user) => user.userId === paramUserId);
            if (!!findUserReceiverId.length) {
              emitSocket("sendNotif", createObjNewMessages)
            }
          }

          setMappedMessages((oldArray) => [...oldArray, createObjNewMessages]);
          scrollRef.current?.lastElementChild?.scrollIntoView({
            behaviour: "smooth",
          });
        }
      })
      .catch((error) => {
        console.log("failed to create new message:", error.response);
      });
  };

  const hitApiGetMessagesData = (
    userAccessToken,
    userIdFromUrlParam,
    currentSliceUserId
  ) => {
    getAllMessagesData(userAccessToken)
      .then((messagesData) => {
        const { totalMessages } = messagesData.data;
        if (totalMessages) {
          const allMessagesMerged = [];
          const allMessagesDataFromDB = messagesData.data.messagesData;
          const sentMessages = allMessagesDataFromDB.filter((message) => {
            return (
              message.UserId === currentSliceUserId &&
              message.receiver_id === userIdFromUrlParam
            );
          });
          const incomingMessages = allMessagesDataFromDB.filter((message) => {
            return (
              message.receiver_id === currentSliceUserId &&
              message.UserId === userIdFromUrlParam
            );
          });
          sentMessages.forEach((messageSent) => { allMessagesMerged.push(messageSent) });
          incomingMessages.forEach((messageIncoming) => { allMessagesMerged.push(messageIncoming) });
          setAllMessages(allMessagesMerged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } else {
          setAllMessages([]);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("failed get messages data:", error.response);
        }
      });
  };

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("incommingPrivateMessage", (incommingMessage) => {
      setMappedMessages((oldArray) => [...oldArray, incommingMessage]);
    });
    socket.current.on("getWrittingStatus", (writingStatus) => {
      setWhoIsWriting(writingStatus);
    });
    return () => {
      setMappedMessages([]);
      setWhoIsWriting("");
      setAllMessages([]);
      setIsThisUserVisitedMyProfile(false);
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.on("getNotifStatus", (notifStatus) => {
      dispatch(setSnapUserLogout({ isUserLogout: notifStatus }));
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUserIdFromSlice && paramUserId) {
      socket.current.emit("addOnlineUsers", {
        currentUserId: currentUserIdFromSlice,
        inOtherPersonProfilePageId: paramUserId,
      });
      socket.current.on("usersOnline", (usersFromServer) => {
        const mappedUsersOnline = usersFromServer.map((user) => user);
        setUsersOnline(mappedUsersOnline);
      });
    }

    return () => {
      setUsersOnline([]);
    };
  }, [currentUserIdFromSlice, paramUserId]);

  useEffect(() => {
    if (messageText.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messageText]);

  useEffect(() => {
    if (isThisUserVisitedMyProfile === true) {
      if (isTyping) {
        socket.current.emit("writingStatus", {
          writerName: currentUserNameFromSlice,
          writerId: currentUserIdFromSlice,
          receiverId: paramUserId,
          status: `${currentUserNameFromSlice} sedang mengetik ...`,
        });
      } else {
        socket.current.emit("writingStatus", {
          writerName: currentUserNameFromSlice,
          writerId: currentUserIdFromSlice,
          receiverId: paramUserId,
          status: "",
        });
      }
    } else {
      setWhoIsWriting("");
    }
  }, [
    isTyping,
    currentUserNameFromSlice,
    currentUserIdFromSlice,
    isThisUserVisitedMyProfile,
    paramUserId,
  ]);

  useEffect(() => {
    if (usersOnline.length && paramUserId) {
      const findThisUserWhenOnline = usersOnline.find((user) => user.userId === paramUserId);
      const userProfileIdVisited = findThisUserWhenOnline?.userProfileIdVisited;
      const isThisUserAlsoVisitedMe = userProfileIdVisited === currentUserIdFromSlice;
      // console.log("Dimanakah user ini sedang berada:", userProfileIdVisited);
      // console.log(
      //   isThisUserAlsoVisitedMe
      //     ? "User ini sedang mengunjungi anda"
      //     : "User ini tidak sedang mengunjungi anda"
      // );
      setIsThisUserVisitedMyProfile(isThisUserAlsoVisitedMe);
    }

    return () => {
      setIsThisUserVisitedMyProfile(false);
    };
  }, [usersOnline, currentUserIdFromSlice, paramUserId]);

  useEffect(() => {
    const newMappedMessages = allMessages.map((message) => {
      return {
        id: message.id,
        receiverId: message.receiver_id,
        senderId: message.UserId,
        username: message.User.userName,
        textMessage: message.message_text,
        messageCreateDate: message.createdAt,
      };
    });

    setMappedMessages(newMappedMessages);
  }, [allMessages]);

  useEffect(() => {
    if (currentUserIdFromSlice && access_token) {
      hitApiGetMessagesData(access_token, paramUserId, currentUserIdFromSlice);
    }
  }, [access_token, paramUserId, currentUserIdFromSlice]);

  const mappedMessageForRendering = useMemo(() => {
    const messages = mappedMessages;
    return messages;
  }, [mappedMessages]);

  return (
    <div className="message-box">
      {/* message data section */}
      <div className="message-data-container" ref={scrollRef}>
        {mappedMessageForRendering &&
          mappedMessageForRendering.map((messageItem, index) => (
            <TextItems
              key={index}
              messageItem={messageItem}
              paramUserId={paramUserId}
            />
          ))}
      </div>

      {/* Send message container */}
      <div className="send-message-container">
        {displayWhoIsWritting()}
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
        </div>
      </div>
    </div>
  );
};

export default memo(MessageBox);