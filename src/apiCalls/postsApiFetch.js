import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CLOUDINARY_API_URL = process.env.REACT_APP_CLOUDINARY_API_URL;
const POSTS_URL = `${BASE_URL}posts/`;

export const getAllPosts = (size) => {
  const user_access_token = accessToken();
  return axios.get(`${POSTS_URL}?size=${size}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllPostsBySearch = (querySearch) => {
  const user_access_token = accessToken();
  return axios.get(`${POSTS_URL}search-posts/?searchTerms=${querySearch}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const createNewPosting = (payloadData) => {
  const user_access_token = accessToken();
  return axios.post(`${POSTS_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const uploadImagePosting = (imageData, config) => {
  return axios.post(`${CLOUDINARY_API_URL}`, imageData, config);
};

export const updatePostById = (idOfPost, payloadData) => {
  const user_access_token = accessToken();
  return axios.put(`${POSTS_URL}/${idOfPost}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
