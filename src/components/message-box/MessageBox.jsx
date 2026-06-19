import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import {
  getAllMessagesData,
  createNewMessageData,
} from "../../apiCalls/messagesApiFetch";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";

import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setIsGetMessageNotif } from "../../redux/slices/userSlice";
import { updateTheMessageById } from "../../apiCalls/messagesApiFetch";
import { getRealMessage } from "./message-box-helper";

import TextItems from "./text-items/TextItems";
import TextInputMessageSection from "./text-input-message-section/TextInputMessageSection";

import "./MessageBox.scss";

const MessageBox = ({ paramUserId }) => {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE,
  );
  const dispatch = useDispatch();

  const socket = useRef(null);
  const scrollRef = useRef(null);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);

  const [usersOnline, setUsersOnline] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [mappedMessages, setMappedMessages] = useState([]);
  const [whoIsWriting, setWhoIsWriting] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageReadyToReply, setMessageReadyToReply] = useState(null);

  const isThisUserVisitedMyProfile = useMemo(() => {
    if (usersOnline.length && paramUserId) {
      const findThisUserWhenOnline = usersOnline.find(
        (user) => user.userId === paramUserId,
      );
      const userProfileIdVisited = findThisUserWhenOnline?.userProfileIdVisited;
      const isThisUserAlsoVisitedMe =
        userProfileIdVisited === currentUserIdFromSlice;

      return isThisUserAlsoVisitedMe;
    }

    return false;
  }, [usersOnline, currentUserIdFromSlice, paramUserId]);

  const emitSocket = (emitName, payload) => {
    socket.current.emit(emitName, payload);
  };

  const onSocket = (name, callbackFun) => {
    socket.current.on(name, callbackFun);
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
          error.response.data.err.message,
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

          if (isThisUserVisitedMyProfile) {
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
              (user) => user.userId === paramUserId,
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

  const handleClickReply = useCallback((messageData) => {
    const transformedMessageReplyData = {
      ...messageData,
      textMessage: getRealMessage(messageData.textMessage),
    };
    setMessageReadyToReply(transformedMessageReplyData);
  }, []);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO_URL);

    onSocket("incommingPrivateMessage", (incommingMessage) => {
      setMappedMessages((oldArray) => [...oldArray, incommingMessage]);
    });

    onSocket("getWrittingStatus", (writingStatus) => {
      setWhoIsWriting(writingStatus);
    });

    return () => {
      setMappedMessages([]);
      setWhoIsWriting("");
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    onSocket("getNotifStatus", (notifStatus) => {
      dispatch(setIsGetMessageNotif({ isMessageNotif: notifStatus }));
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUserIdFromSlice && paramUserId) {
      emitSocket("addOnlineUsers", {
        currentUserId: currentUserIdFromSlice,
        inOtherPersonProfilePageId: paramUserId,
      });

      onSocket("usersOnline", (usersFromServer) => {
        const mappedUsersOnline = usersFromServer.map((user) => user);
        setUsersOnline(mappedUsersOnline);
      });
    }

    return () => {
      setUsersOnline([]);
    };
  }, [currentUserIdFromSlice, paramUserId]);

  useEffect(() => {
    if (isThisUserVisitedMyProfile) {
      if (isTyping) {
        emitSocket("writingStatus", {
          writerName: currentUserNameFromSlice,
          writerId: currentUserIdFromSlice,
          receiverId: paramUserId,
          status: `${currentUserNameFromSlice} sedang mengetik ...`,
        });
      } else {
        emitSocket("writingStatus", {
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
    const hitApiGetMessagesData = async (userIdFromUrlParam) => {
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
    };

    if (currentUserIdFromSlice) {
      hitApiGetMessagesData(paramUserId);
    }

    return () => {
      setMappedMessages([]);
      setMessageReadyToReply(null);
    };
  }, [paramUserId, currentUserIdFromSlice]);

  return (
    <div className="message-box">
      {/* message list section */}
      <div className="message-data-container" ref={scrollRef}>
        {mappedMessages &&
          mappedMessages.map((messageItem, index) => (
            <TextItems
              key={index}
              messageItem={messageItem}
              paramUserId={paramUserId}
              isShowTriangle={
                index === 0 ||
                (messageItem.senderId !== mappedMessages[index - 1].senderId &&
                  messageItem.receiverId !==
                    mappedMessages[index - 1].receiverId)
              }
              handleClickReply={handleClickReply}
            />
          ))}
      </div>

      {/* Text Input Send message container */}
      <TextInputMessageSection
        isThisUserVisitedMyProfile={isThisUserVisitedMyProfile}
        whoIsWriting={whoIsWriting}
        messageReadyToReply={messageReadyToReply}
        messageText={messageText}
        loadingState={loadingState}
        setMessageReadyToReply={setMessageReadyToReply}
        doCreateNewMessageWithEnter={doCreateNewMessageWithEnter}
        handleTypingMessage={handleTypingMessage}
        sendNewMessage={sendNewMessage}
        setIsTyping={setIsTyping}
      />
    </div>
  );
};

export default memo(MessageBox);
