import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PROFILE_URL = `${BASE_URL}profiles`;

export const updateProfileById = (userToken, idOfProfile, payloadData) => {
  return axios.put(`${PROFILE_URL}/${idOfProfile}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
