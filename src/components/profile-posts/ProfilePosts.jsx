import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsAvailableByUserId } from "../../redux/apiCalls";
import ShareBox from "../../components/share/Share";
import Post from "../../components/posting/Post";
import EmptyStatePosts from "../../components/empty-state-posts/EmptyStatePosts";
import LoadingPosts from "../../components/loading-posts/LoadingPosts";
import MessageBox from "../../components/message-box/MessageBox";
import {
  setPostsByUserId,
  setPostsTotalByUserId,
  setIsAddPosting,
  setLoadingGetPostsById,
} from "../../redux/slices/postsSlice";

import "./ProfilePosts.scss";

export default function ProfilePosts({ paramUserId, userNameFromParam }) {
  const dispatch = useDispatch();

  const paramsEmptyState = { username: userNameFromParam };

  const searchTermsFromSlice = useSelector((state) => state.posts.searchPostsTerms);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const isPostsloadingByUserId = useSelector((state) => state.posts.loadingGetPostsByUserId);
  const postsFromSliceByUserId = useSelector((state) => state.posts.postsByUserId);
  const postAddNewPostingStatus = useSelector((state) => state.posts.isAddPosting);

  const [postsByUserIdMapped, setPostsByUserIdMapped] = useState(postsFromSliceByUserId);

  const isLoading = useMemo(
    () => isPostsloadingByUserId === true,
    [isPostsloadingByUserId]
  );

  const displayProfilePosts = () => {
    if (postsByUserIdMapped.length) {
      return (
        <Fragment>
          {postsByUserIdMapped.map((post) => (
            <Post key={post.id} postedData={post} />
          ))}
        </Fragment>
      );
    }

    const isProfilePageUserLoggedin = paramUserId === currentUserIdFromSlice;
    return (
      <EmptyStatePosts
        params={{
          ...paramsEmptyState,
          location: isProfilePageUserLoggedin
            ? "profile-page-user-loggedin"
            : "profile-page-other-user",
        }}
      />
    );
  };

  useEffect(() => {
    if (postsFromSliceByUserId.length) {
      const mappedPostData = postsFromSliceByUserId.map((item) => item);
      const newFilteredPostByUserId = mappedPostData.filter((post) => {
        return (
          post?.postCaption.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
          post?.User?.userName.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
          post?.User?.userFullname.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
          post?.User?.userEmail.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
          post?.User?.userEmail.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
          post?.status.toLowerCase().includes(searchTermsFromSlice.toLowerCase())
        );
      });
      setPostsByUserIdMapped(newFilteredPostByUserId);
    }

    return () => {
      setPostsByUserIdMapped([]);
    };
  }, [postsFromSliceByUserId, searchTermsFromSlice]);

  useEffect(() => {
    getPostsAvailableByUserId(paramUserId, dispatch);

    return () => {
      dispatch(setPostsTotalByUserId({ totalOfPostsByUserId: 0 }));
      dispatch(setLoadingGetPostsById({ getAllPostsByUserIdLoading: true }));
      dispatch(setPostsByUserId({ postDataByUserId: [] }));
      dispatch(setIsAddPosting({ isSuccessPosting: false }));
    };
  }, [postAddNewPostingStatus, paramUserId, dispatch]);

  return (
    <Fragment>
      {paramUserId === currentUserIdFromSlice && (
        <ShareBox userNameFromParam={userNameFromParam} />
      )}

      {paramUserId !== currentUserIdFromSlice && (
        <MessageBox paramUserId={paramUserId} />
      )}

      {isLoading ? <LoadingPosts /> : displayProfilePosts()}
    </Fragment>
  );
}
