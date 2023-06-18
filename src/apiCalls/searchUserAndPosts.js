import axios from "axios";
import { accessToken } from "../utils/getLocalStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SEARCH_USERS_AND_POSTS_URL = `${BASE_URL}users/search-user`;

export const searchAllUsersAndPostsData = (querySerch) => {
  const user_access_token = accessToken();
  return axios.get(`${SEARCH_USERS_AND_POSTS_URL}/?searchTerms=${querySerch}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${user_access_token}`,
    },
  });
};
