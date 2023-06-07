import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";
const user_access_token = accessToken();

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const POSTS_URL = `${BASE_URL}posts/`;

export const getAllPosts = () => {
  return axios.get(`${POSTS_URL}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const getAllPostsBySearch = (querySearch) => {
  return axios.get(`${POSTS_URL}search-posts/?searchTerms=${querySearch}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const createNewPosting = (payloadData) => {
  return axios.post(`${POSTS_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};

export const uploadImagePosting = (imageData, config) => {
  return axios.post(
    "https://api.cloudinary.com/v1_1/adamwijaya/image/upload",
    imageData,
    config
  );
};
