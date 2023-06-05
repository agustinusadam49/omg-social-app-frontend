import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const COMMENTS_URL = `${BASE_URL}comments`;
const REPLY_COMMENTS_URL = `${BASE_URL}reply-comments`;

export const createNewCommentData = (userToken, payloadData) => {
  return axios.post(`${COMMENTS_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllCommentsData = (userToken) => {
  return axios.get(`${COMMENTS_URL}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllCommentsDataByPostId = (userToken, idPost) => {
  return axios.get(`${COMMENTS_URL}/by-post-id/${idPost}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

// REPLY COMMENT APIS
export const addNewReplyCommentData = (userToken, payloadData) => {
  return axios.post(`${REPLY_COMMENTS_URL}/`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllRepliesDataByCommentId = (userToken, idComment) => {
  return axios.get(`${REPLY_COMMENTS_URL}/${idComment}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
