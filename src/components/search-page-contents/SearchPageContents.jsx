import React, { useState, useEffect, Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import SearchUserItems from "../search-user-items/SearchUserItems";
import SearchPostItems from "../search-post-items/SearchPostItems";
import { searchAllUsersAndPostsData } from "../../apiCalls/searchUserAndPosts";
import { getAllPostsBySearch } from "../../apiCalls/postsApiFetch";

import "./SearchPageContents.scss";

export default function SearchPageContents() {
  const [searchParams] = useSearchParams();
  let queryParamsUrl = searchParams.get("query");
  const [searchedUserItems, setSearchedUserItems] = useState([]);
  const [searchedPostItems, setSearchedPostItems] = useState([]);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");

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

    return () => {
      setSearchedPostItems([]);
      setSearchErrorMessage("")
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

    return () => {
      setSearchedUserItems([]);
      setSearchErrorMessage("")
    }
  }, [queryParamsUrl]);

  return (
    <div className="search-page-contents">
      {displaySearchResultOfUsers()}
      {displaySearchResultOfPosts()}
      {displayErrorSearchErrorMessage()}
    </div>
  );
}
