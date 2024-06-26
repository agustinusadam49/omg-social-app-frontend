import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TextItems from "./text-items/TextItems";
import {
  getAllMessagesData,
  createNewMessageData,
} from "../../apiCalls/messagesApiFetch";
import { setIsGetMessageNotif } from "../../redux/slices/userSlice";
import { updateTheMessageById } from "../../apiCalls/messagesApiFetch";
import { io } from "socket.io-client";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import "./MessageBox.scss";

const MessageBox = ({ paramUserId }) => {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();

  const socket = useRef(null);
  const scrollRef = useRef(null);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserAvatarFromSlice = useSelector((state) => state.user.userAvatarPicture);

  const [usersOnline, setUsersOnline] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [mappedMessages, setMappedMessages] = useState([]);
  const [whoIsWriting, setWhoIsWriting] = useState("");
  const [isThisUserVisitedMyProfile, setIsThisUserVisitedMyProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageReadyToReply, setMessageReadyToReply] = useState(null);

  const emitSocket = (emitName, payload) => {
    socket.current.emit(emitName, payload);
  };

  const handleTypingMessage = (value) => {
    setMessageText(value);
  };

  const sendNewMessage = () => {
    if (loadingState.status) return;
    hitApiCreateNewMessage();
  };

  const doCreateNewMessageWithEnter = (event) => {
    if (loadingState.status) return;
    if (event.key === "Enter" && messageText !== "") {
      hitApiCreateNewMessage();
    }
  };

  const hitApiUpdateMessageById = (messageId, payloadBody) => {
    updateTheMessageById(messageId, payloadBody)
      .then(() => {})
      .catch((error) => {
        console.log(
          "failed edit message by id message:",
          error.response.data.err.message
        );
      });
  };

  const hitApiCreateNewMessage = () => {
    mutate({ type: actionType.RUN_LOADING_STATUS });

    const messageAndReplyDataObj = {
      messageSourceId: messageReadyToReply ? messageReadyToReply.id : null,
      senderSourceId: messageReadyToReply ? messageReadyToReply.senderId : null,
      textSourceMessage: messageReadyToReply
        ? messageReadyToReply.textMessage
        : null,
      usernameSource: messageReadyToReply ? messageReadyToReply.username : null,
      realTextMessage: messageText,
    };

    const payloadToCreateMessage = {
      receiver_id: paramUserId,
      message_text: JSON.stringify(messageAndReplyDataObj),
      senderName: currentUserNameFromSlice,
    };

    createNewMessageData(payloadToCreateMessage)
      .then((newMessageResult) => {
        const successCreateNewMessage = newMessageResult.data.success;
        if (successCreateNewMessage === true) {
          setMessageText("");
          setMessageReadyToReply(null);
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
            hitApiUpdateMessageById(newMessageDataDB.id, {
              receiver_id: newMessageDataDB.receiver_id,
              message_text: newMessageDataDB.message_text,
              isRead: true,
              UserId: newMessageDataDB.UserId,
            });
            emitSocket("sendPrivateMessage", createObjNewMessages);
            emitSocket("sendNotif", createObjNewMessages);
          } else {
            const findUserReceiverId = usersOnline.filter(
              (user) => user.userId === paramUserId
            );
            if (!!findUserReceiverId.length) {
              emitSocket("sendNotif", createObjNewMessages);
            }
          }

          setMappedMessages((oldArray) => [...oldArray, createObjNewMessages]);
          scrollRef.current?.lastElementChild?.scrollIntoView({
            behaviour: "smooth",
            block: "start",
            inline: "nearest",
          });

          mutate({ type: actionType.STOP_LOADING_STATUS });
        }
      })
      .catch((error) => {
        console.log("failed to create new message:", error.response);
        mutate({ type: actionType.STOP_LOADING_STATUS });
      });
  };

  const hitApiGetMessagesData = useCallback(async (userIdFromUrlParam) => {
    try {
      const chatData = await getAllMessagesData(userIdFromUrlParam);
      const { totalMessages } = chatData.data;

      if (totalMessages) {
        const { messagesData } = chatData.data;

        const newMappedMessages = messagesData.map((message) => {
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
      } else {
        setMappedMessages([]);
      }
    } catch (error) {
      if (error.response) {
        console.error("failed get messages data:", error.response);
      }
    }
  }, []);

  useEffect(() => {
    // Don't delete these commented code bellow
    // socket.current = io(process.env.REACT_APP_SOCKET_IO_URL, {
    //   withCredentials: true,
    //   extraHeaders: {
    //     "my-custom-header": "abcd"
    //   }
    // });
    socket.current = io(process.env.REACT_APP_SOCKET_IO_URL);
    socket.current.on("incommingPrivateMessage", (incommingMessage) => {
      setMappedMessages((oldArray) => [...oldArray, incommingMessage]);
    });
    socket.current.on("getWrittingStatus", (writingStatus) => {
      setWhoIsWriting(writingStatus);
    });
    return () => {
      setMappedMessages([]);
      setWhoIsWriting("");
      setIsThisUserVisitedMyProfile(false);
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.on("getNotifStatus", (notifStatus) => {
      dispatch(setIsGetMessageNotif({ isMessageNotif: notifStatus }));
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
      const findThisUserWhenOnline = usersOnline.find(
        (user) => user.userId === paramUserId
      );
      const userProfileIdVisited = findThisUserWhenOnline?.userProfileIdVisited;
      const isThisUserAlsoVisitedMe =
        userProfileIdVisited === currentUserIdFromSlice;
      // Don't delete these commented code bellow
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
    if (currentUserIdFromSlice) {
      hitApiGetMessagesData(paramUserId);
    }

    return () => {
      setMappedMessages([]);
      setMessageReadyToReply(null);
    };
  }, [paramUserId, currentUserIdFromSlice, hitApiGetMessagesData]);

  return (
    <div className="message-box">
      {/* message data section */}
      <div className="message-data-container" ref={scrollRef}>
        {mappedMessages &&
          mappedMessages.map((messageItem, index) => (
            <TextItems
              key={index}
              messageItem={messageItem}
              paramUserId={paramUserId}
              setMessageReadyToReply={setMessageReadyToReply}
              isShowTriangle={
                index === 0 ||
                (messageItem.senderId !== mappedMessages[index - 1].senderId &&
                  messageItem.receiverId !==
                    mappedMessages[index - 1].receiverId)
              }
            />
          ))}
      </div>

      {/* Send message container */}
      <div className="send-message-container">
        {isThisUserVisitedMyProfile === true ? (
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
    </div>
  );
};

export default memo(MessageBox);
