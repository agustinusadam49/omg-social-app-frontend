import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SEARCH_USERS_AND_POSTS_URL = `${BASE_URL}users/search-user`;

export const searchAllUsersAndPostsData = (userToken, querySerch) => {
  return axios.get(`${SEARCH_USERS_AND_POSTS_URL}/?searchTerms=${querySerch}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  });
};
