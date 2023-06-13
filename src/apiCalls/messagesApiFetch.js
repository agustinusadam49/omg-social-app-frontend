import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MESSAGES_URL = `${BASE_URL}messages`;

export const createNewMessageData = (userToken, payloadData) => {
  return axios.post(`${MESSAGES_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllMessagesData = (userToken, userIdFromUrlParam) => {
  return axios.get(
    `${MESSAGES_URL}/`,
    {
      params: { userReceiverId: parseInt(userIdFromUrlParam) },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
    }
  );
};

export const updateTheMessageById = (userToken, idOfMessage, payloadData) => {
  return axios.put(`${MESSAGES_URL}/${idOfMessage}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
