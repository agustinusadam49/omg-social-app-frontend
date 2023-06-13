import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const FOLLOWS_URL = `${BASE_URL}follows/`;

export const addNewFollower = (userToken, payloadData) => {
  return axios.post(`${FOLLOWS_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const deleteFollowById = (userToken, followId) => {
  return axios.delete(`${FOLLOWS_URL}${followId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
