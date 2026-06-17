export const getRealMessage = (textObjInString) => {
  const messageTextObj = JSON.parse(textObjInString);
  const messageTextStr = messageTextObj.realTextMessage;
  return messageTextStr;
};
