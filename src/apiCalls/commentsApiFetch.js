import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";
const user_access_token = accessToken();

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const COMMENTS_URL = `${BASE_URL}comments`;
const REPLY_COMMENTS_URL = `${BASE_URL}reply-comments`;

export const createNewCommentData = (payloadData) => {
  return axios.post(`${COMMENTS_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllCommentsData = () => {
  return axios.get(`${COMMENTS_URL}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllCommentsDataByPostId = (idPost) => {
  return axios.get(`${COMMENTS_URL}/by-post-id/${idPost}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

// REPLY COMMENT APIS
export const addNewReplyCommentData = (payloadData) => {
  return axios.post(`${REPLY_COMMENTS_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllRepliesDataByCommentId = (idComment) => {
  return axios.get(`${REPLY_COMMENTS_URL}/${idComment}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
