import React, { useState, useEffect, Fragment } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import SearchUserItems from "../../components/search-user-items/SearchUserItems";
import SearchPostItems from "../../components/search-post-items/SearchPostItems";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { useSearchParams } from "react-router-dom";
import { searchAllUsersAndPostsData } from "../../apiCalls/searchUserAndPosts";
import { getAllPostsBySearch } from "../../apiCalls/postsApiFetch";
import { accessToken } from "../../utils/getLocalStorage";
import "./SearchPage.scss";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  let queryParamsUrl = searchParams.get("query");
  const [searchedUserItems, setSearchedUserItems] = useState([]);
  const [searchedPostItems, setSearchedPostItems] = useState([]);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");
  const dispatch = useDispatch();
  const access_token = accessToken();

  const displaySearchResultOfUsers = () => {
    if (searchedUserItems.length) {
      return (
        <Fragment>
          <div className="title-users-search-result">USERS</div>
          {searchedUserItems.map((user) => (
            <SearchUserItems key={user.id} user={user} />
          ))}
        </Fragment>
      );
    }
  };

  const displaySearchResultOfPosts = () => {
    if (searchedPostItems.length) {
      return (
        <Fragment>
          <div className="title-posts-search-result">POSTS</div>
          {searchedPostItems.map((post) => (
            <SearchPostItems key={post.id} post={post} />
          ))}
        </Fragment>
      );
    }
  };

  const displayErrorSearchErrorMessage = () => {
    if (!searchedUserItems.length && !searchedPostItems.length) {
      return (
        <Fragment>
          <div className="search-error-message-failed">
            {searchErrorMessage}
          </div>
        </Fragment>
      );
    }
  };

  useEffect(() => {
    const hitApiSearchPosts = (searchTermsForPosts, userAccessToken) => {
      getAllPostsBySearch(userAccessToken, searchTermsForPosts)
        .then((searchPostsResult) => {
          setSearchedPostItems(searchPostsResult.data.postData);
        })
        .catch((error) => {
          const errorMessageFailedSearch = error.response.data.err.message;
          setSearchErrorMessage(errorMessageFailedSearch);
          setSearchedPostItems([]);
        });
    };
    if (queryParamsUrl && access_token) {
      hitApiSearchPosts(queryParamsUrl, access_token);
    }
  }, [queryParamsUrl, access_token]);

  useEffect(() => {
    const getUsersAndPostsThroughSearch = (searchTerms, userAccessToken) => {
      searchAllUsersAndPostsData(userAccessToken, searchTerms)
        .then((searchResult) => {
          setSearchedUserItems(searchResult.data.userData);
        })
        .catch((error) => {
          const errorMessageFailedSearch = error.response.data.err.message;
          setSearchErrorMessage(errorMessageFailedSearch);
          setSearchedUserItems([]);
        });
    };
    if (queryParamsUrl && access_token) {
      getUsersAndPostsThroughSearch(queryParamsUrl, access_token);
    }
  }, [queryParamsUrl, access_token]);

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="search-page-container">
      <Leftbar />
      <div className="search-contents">
        {displaySearchResultOfUsers()}
        {displaySearchResultOfPosts()}
        {displayErrorSearchErrorMessage()}
      </div>
      <Rightbar />
    </div>
  );
};