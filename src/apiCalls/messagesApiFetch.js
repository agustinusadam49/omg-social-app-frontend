import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MESSAGES_URL = `${BASE_URL}messages`;

export const createNewMessageData = (payloadData) => {
  const user_access_token = accessToken();
  console.log(user_access_token)
  return axios.post(`${MESSAGES_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllMessagesData = (userIdFromUrlParam) => {
  const user_access_token = accessToken();
  return axios.get(`${MESSAGES_URL}/`, {
    params: { userReceiverId: parseInt(userIdFromUrlParam) },
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const updateTheMessageById = (idOfMessage, payloadData) => {
  const user_access_token = accessToken();
  return axios.put(`${MESSAGES_URL}/${idOfMessage}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
