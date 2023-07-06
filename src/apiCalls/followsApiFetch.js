import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const FOLLOWS_URL = `${BASE_URL}follows/`;

export const addNewFollower = (payloadData) => {
  const user_access_token = accessToken();
  return axios.post(`${FOLLOWS_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const deleteFollowById = (followId) => {
  const user_access_token = accessToken();
  return axios.delete(`${FOLLOWS_URL}${followId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
