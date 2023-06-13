import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const LIKES_URL = `${BASE_URL}likes/`;

export const addNewLike = (userToken, payloadData) => {
  return axios.post(`${LIKES_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const deleteLikeById = (userToken, likeId) => {
  return axios.delete(`${LIKES_URL}${likeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
