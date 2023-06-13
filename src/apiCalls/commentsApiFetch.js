import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const COMMENTS_URL = `${BASE_URL}comments`;
const REPLY_COMMENTS_URL = `${BASE_URL}reply-comments`;

export const createNewCommentData = (payloadData) => {
  const user_access_token = accessToken();
  return axios.post(`${COMMENTS_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllCommentsData = () => {
  const user_access_token = accessToken();
  return axios.get(`${COMMENTS_URL}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllCommentsDataByPostId = (idPost) => {
  const user_access_token = accessToken();
  return axios.get(`${COMMENTS_URL}/by-post-id/${idPost}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

// REPLY COMMENT APIS
export const addNewReplyCommentData = (payloadData) => {
  const user_access_token = accessToken();
  return axios.post(`${REPLY_COMMENTS_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllRepliesDataByCommentId = (idComment) => {
  const user_access_token = accessToken();
  return axios.get(`${REPLY_COMMENTS_URL}/${idComment}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
