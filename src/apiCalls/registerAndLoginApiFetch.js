import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const registerNewUser = (dataPayload) => {
  return axios.post(`${BASE_URL}users/register`, dataPayload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginUser = (dataPayload) => {
  return axios.post(`${BASE_URL}users/login`, dataPayload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const userLogout = (userId, dataPayload) => {
  return axios.put(`${BASE_URL}users/logout/${userId}`, dataPayload);
};

export const getCurrentUserLogin = (userToken) => {
  return axios.get(`${BASE_URL}users/get-current-user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllUsersOmonginApp = (userToken) => {
  return axios.get(`${BASE_URL}users/get-all-users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getUserById = (userToken, user_Id) => {
  return axios.get(`${BASE_URL}users/${user_Id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
