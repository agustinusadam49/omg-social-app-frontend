import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const NOTIFICATIONS_URL = `${BASE_URL}notifications`;

export const createNewNotification = (userToken, payloadData) => {
  return axios.post(`${NOTIFICATIONS_URL}/notif-current-user`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllNotificationsOfCurrentUser = (userToken) => {
  return axios.get(`${NOTIFICATIONS_URL}/notif-current-user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const updateNotificationStatusRead = (
  userToken,
  idOfNotification,
  payloadData
) => {
  return axios.put(`${NOTIFICATIONS_URL}/${idOfNotification}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const updateAllNotificationStatusNotRead = (
  userToken,
  currentUserId,
  payloadData
) => {
  return axios.put(`${NOTIFICATIONS_URL}/${currentUserId}/bulk-update`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const deleteNotificationAndNotifContentById = (
  userToken,
  idOfNotification
) => {
  return axios.delete(
    `${NOTIFICATIONS_URL}/${idOfNotification}/delete-notification`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
    }
  );
};
