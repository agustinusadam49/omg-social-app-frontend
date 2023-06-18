import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const NOTIFICATIONS_URL = `${BASE_URL}notifications`;

export const createNewNotification = (payloadData) => {
  const user_access_token = accessToken();
  return axios.post(`${NOTIFICATIONS_URL}/notif-current-user`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllNotificationsOfCurrentUser = () => {
  const user_access_token = accessToken();
  return axios.get(`${NOTIFICATIONS_URL}/notif-current-user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const updateNotificationStatusRead = (idOfNotification, payloadData) => {
  const user_access_token = accessToken();
  return axios.put(`${NOTIFICATIONS_URL}/${idOfNotification}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const updateAllNotificationStatusNotRead = (
  currentUserId,
  payloadData
) => {
  const user_access_token = accessToken();
  return axios.put(
    `${NOTIFICATIONS_URL}/${currentUserId}/bulk-update`,
    payloadData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${user_access_token}`,
      },
    }
  );
};

export const deleteNotificationAndNotifContentById = (idOfNotification) => {
  const user_access_token = accessToken();
  return axios.delete(
    `${NOTIFICATIONS_URL}/${idOfNotification}/delete-notification`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${user_access_token}`,
      },
    }
  );
};
