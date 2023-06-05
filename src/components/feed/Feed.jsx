import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  getPostsAvailable,
  getPostsAvailableByUserId,
} from "../../redux/apiCalls";

import ShareBox from "../../components/share/Share";
import Post from "../../components/posting/Post";
import EmptyStatePosts from "../../components/empty-state-posts/EmptyStatePosts";
import LoadingPosts from "../../components/loading-posts/LoadingPosts";
import MessageBox from "../../components/message-box/MessageBox";
import { accessToken } from "../../utils/getLocalStorage";
import {
  setPosts,
  setPostsByUserId,
  setPostsTotal,
  setPostsTotalByUserId,
  setIsAddPosting,
  setLoadingGetPosts,
  setLoadingGetPostsById,
} from "../../redux/slices/postsSlice";

import "./Feed.scss";

export default function Feed({ profile, userId, username }) {
  const dispatch = useDispatch();

  const access_token = accessToken();
  const userNameFromParam = username;
  const paramUserId = parseInt(userId);

  const paramsEmptyState = {
    username: userNameFromParam,
    userId: paramUserId ? paramUserId : null,
  };

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const postsFromSlice = useSelector((state) => state.posts.posts);
  const postsFromSliceByUserId = useSelector(
    (state) => state.posts.postsByUserId
  );
  const postAddNewPostingStatus = useSelector(
    (state) => state.posts.isAddPosting
  );
  const isPostsloading = useSelector((state) => state.posts.loadingGetPosts);
  const isPostsloadingByUserId = useSelector(
    (state) => state.posts.loadingGetPostsByUserId
  );
  const searchTermsFromSlice = useSelector(
    (state) => state.posts.searchPostsTerms
  );

  const [filteredPosts, setFilteredPosts] = useState(postsFromSlice);

  useEffect(() => {
    const newFilteredUserPosts = postsFromSlice.filter((item) => {
      return (
        item?.postCaption.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userName.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userFullname.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userEmail.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userEmail.toLowerCase().includes(searchTermsFromSlice.toLowerCase())
      );
    });
    setFilteredPosts(newFilteredUserPosts);

    return () => {
      setFilteredPosts([]);
    };
  }, [postsFromSlice, searchTermsFromSlice]);

  const displayLoading = () => {
    return <LoadingPosts />;
  };

  const displayHomePosts = () => {
    if (filteredPosts.length) {
      return (
        <Fragment>
          {filteredPosts.map((post) => (
            <Post key={post.id} postedData={post} />
          ))}
        </Fragment>
      );
    }

    return (
      <EmptyStatePosts
        params={{ ...paramsEmptyState, location: "home-page" }}
      />
    );
  };

  const displayProfilePosts = () => {
    if (postsFromSliceByUserId.length) {
      return (
        <Fragment>
          {postsFromSliceByUserId.map((post) => (
            <Post key={post.id} postedData={post} />
          ))}
        </Fragment>
      );
    }

    if (
      !postsFromSliceByUserId.length &&
      paramUserId === currentUserIdFromSlice
    ) {
      return (
        <EmptyStatePosts
          params={{
            ...paramsEmptyState,
            location: "profile-page-user-loggedin",
          }}
        />
      );
    }

    if (
      !postsFromSliceByUserId.length &&
      paramUserId !== currentUserIdFromSlice
    ) {
      return (
        <EmptyStatePosts
          params={{ ...paramsEmptyState, location: "profile-page-other-user" }}
        />
      );
    }
  };

  useEffect(() => {
    if (profile && access_token) {
      getPostsAvailableByUserId(access_token, paramUserId, dispatch);
    } else {
      if (access_token) getPostsAvailable(access_token, dispatch);
    }

    return () => {
      dispatch(setPosts({ postData: [] }));
      dispatch(setPostsByUserId({ postDataByUserId: [] }));
      dispatch(setPostsTotalByUserId({ totalOfPostsByUserId: 0 }));
      dispatch(setPostsTotal({ totalOfPosts: 0 }));
      dispatch(setLoadingGetPostsById({ getAllPostsByUserIdLoading: true }));
      dispatch(setLoadingGetPosts({ getAllPostsLoading: true }));
      dispatch(setIsAddPosting({ isSuccessPosting: false }));
    };
  }, [access_token, postAddNewPostingStatus, paramUserId, profile, dispatch]);

  return (
    <div className="feed">
      <div className="feed-wrapper">
        {profile ? (
          <Fragment>
            {paramUserId === currentUserIdFromSlice && (
              <ShareBox userNameFromParam={userNameFromParam} />
            )}

            {paramUserId !== currentUserIdFromSlice && (
              <MessageBox paramUserId={paramUserId} />
            )}

            {isPostsloadingByUserId ? displayLoading() : displayProfilePosts()}
          </Fragment>
        ) : (
          <Fragment>
            <ShareBox />
            {isPostsloading ? displayLoading() : displayHomePosts()}
          </Fragment>
        )}
      </div>
    </div>
  );
}
