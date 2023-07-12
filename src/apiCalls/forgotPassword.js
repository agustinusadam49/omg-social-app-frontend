import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getUserByEmail = (userEmailQuery) => {
  return axios.get(
    `${BASE_URL}users/get-by-email?userEmail=${userEmailQuery}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const changeForgotPassword = (userEmail, payloadData) => {
  return axios.put(`${BASE_URL}users/${userEmail}/update-password`, payloadData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
