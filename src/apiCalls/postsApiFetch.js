import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const POSTS_URL = `${BASE_URL}posts/`;

export const getAllPosts = (userToken) => {
  return axios.get(`${POSTS_URL}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const getAllPostsBySearch = (userToken, querySearch) => {
  return axios.get(`${POSTS_URL}search-posts/?searchTerms=${querySearch}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};

export const createNewPosting = (userToken, payloadData) => {
  return axios.post(`${POSTS_URL}`, payloadData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
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
