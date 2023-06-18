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
import "./SearchPage.scss";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  let queryParamsUrl = searchParams.get("query");
  const [searchedUserItems, setSearchedUserItems] = useState([]);
  const [searchedPostItems, setSearchedPostItems] = useState([]);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");
  const dispatch = useDispatch();

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
    const hitApiSearchPosts = (searchTermsForPosts) => {
      getAllPostsBySearch(searchTermsForPosts)
        .then((searchPostsResult) => {
          setSearchedPostItems(searchPostsResult.data.postData);
        })
        .catch((error) => {
          const errorMessageFailedSearch = error.response.data.err.message;
          setSearchErrorMessage(errorMessageFailedSearch);
          setSearchedPostItems([]);
        });
    };
    if (queryParamsUrl) {
      hitApiSearchPosts(queryParamsUrl);
    }
  }, [queryParamsUrl]);

  useEffect(() => {
    const getUsersAndPostsThroughSearch = (searchTerms) => {
      searchAllUsersAndPostsData(searchTerms)
        .then((searchResult) => {
          setSearchedUserItems(searchResult.data.userData);
        })
        .catch((error) => {
          const errorMessageFailedSearch = error.response.data.err.message;
          setSearchErrorMessage(errorMessageFailedSearch);
          setSearchedUserItems([]);
        });
    };
    if (queryParamsUrl) {
      getUsersAndPostsThroughSearch(queryParamsUrl);
    }
  }, [queryParamsUrl]);

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

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