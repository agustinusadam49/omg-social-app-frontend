import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PROFILE_URL = `${BASE_URL}profiles`;

export const updateProfileById = (idOfProfile, payloadData) => {
  const user_access_token = accessToken();
  return axios.put(`${PROFILE_URL}/${idOfProfile}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
