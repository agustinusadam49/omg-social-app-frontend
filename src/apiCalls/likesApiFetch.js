import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const LIKES_URL = `${BASE_URL}likes/`;

export const addNewLike = (payloadData) => {
  const user_access_token = accessToken();
  return axios.post(`${LIKES_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const deleteLikeById = (likeId) => {
  const user_access_token = accessToken();
  return axios.delete(`${LIKES_URL}${likeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
