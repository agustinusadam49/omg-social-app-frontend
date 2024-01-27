import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingPosts from "../../components/loading-posts/LoadingPosts";
import EmptyStatePosts from "../../components/empty-state-posts/EmptyStatePosts";
import ShareBox from "../../components/share/Share";
import Post from "../../components/posting/Post";
import { getPostsAvailable } from "../../redux/apiCalls";
import {
  setPosts,
  setPostsTotal,
  setIsAddPosting,
  setLoadingGetPosts,
} from "../../redux/slices/postsSlice";

import "./HomePosts.scss";

export default function HomePosts() {
  const dispatch = useDispatch();

  const paramsEmptyState = { username: "" };

  const isPostsloading = useSelector((state) => state.posts.loadingGetPosts);
  const postsFromSlice = useSelector((state) => state.posts.posts);
  const postAddNewPostingStatus = useSelector(state => state.posts.isAddPosting);
  const searchTermsFromSlice = useSelector((state) => state.posts.searchPostsTerms);

  const [filteredPosts, setFilteredPosts] = useState(postsFromSlice);

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

  useEffect(() => {
    const newFilteredUserPosts = postsFromSlice.filter((item) => {
      return (
        item?.postCaption.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userName.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userFullname.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userEmail.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userEmail.toLowerCase().includes(searchTermsFromSlice.toLowerCase()) ||
        item?.status.toLowerCase().includes(searchTermsFromSlice.toLowerCase())
      );
    });
    setFilteredPosts(newFilteredUserPosts);

    return () => {
      setFilteredPosts([]);
    };
  }, [postsFromSlice, searchTermsFromSlice]);

  useEffect(() => {
    getPostsAvailable(dispatch);

    return () => {
      dispatch(setPosts({ postData: [] }));
      dispatch(setPostsTotal({ totalOfPosts: 0 }));
      dispatch(setLoadingGetPosts({ getAllPostsLoading: true }));
      dispatch(setIsAddPosting({ isSuccessPosting: false }));
    };
  }, [postAddNewPostingStatus, dispatch]);

  return (
    <Fragment>
      <ShareBox />
      {isPostsloading ? displayLoading() : displayHomePosts()}
    </Fragment>
  );
}
