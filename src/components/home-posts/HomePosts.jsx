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
import GlobalButton from "../button/GlobalButton";
import RoundedLoader from "../rounded-loader/RoundedLoader";

import "./HomePosts.scss";

export default function HomePosts() {
  const dispatch = useDispatch();

  const paramsEmptyState = { username: "" };

  const isPostsloading = useSelector((state) => state.posts.loadingGetPosts);
  const postsFromSlice = useSelector((state) => state.posts.posts);
  const postAddNewPostingStatus = useSelector((state) => state.posts.isAddPosting);
  const searchTermsFromSlice = useSelector((state) => state.posts.searchPostsTerms);
  const totalPostFromApi = useSelector((state) => state.posts.postsTotal);

  const [filteredPosts, setFilteredPosts] = useState(postsFromSlice);
  const [size, setSize] = useState(5);
  const [loadingSeeMore, setLoadingSeeMore] = useState(false);

  const handleSeeMore = () => {
    let currentSize = size + 5;

    if (currentSize > totalPostFromApi) {
      currentSize = totalPostFromApi;
    }

    setLoadingSeeMore(true);

    setTimeout(() => {
      setLoadingSeeMore(false);
      setSize(currentSize);
    }, 1000);
  };

  useEffect(() => {
    const newFilteredUserPosts = postsFromSlice.filter((item) => {
      return (
        item?.postCaption
          .toLowerCase()
          .includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userName
          .toLowerCase()
          .includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userFullname
          .toLowerCase()
          .includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userEmail
          .toLowerCase()
          .includes(searchTermsFromSlice.toLowerCase()) ||
        item?.User?.userEmail
          .toLowerCase()
          .includes(searchTermsFromSlice.toLowerCase()) ||
        item?.status.toLowerCase().includes(searchTermsFromSlice.toLowerCase())
      );
    });
    setFilteredPosts(newFilteredUserPosts);

    return () => {
      setFilteredPosts([]);
    };
  }, [postsFromSlice, searchTermsFromSlice]);

  useEffect(() => {
    getPostsAvailable(dispatch, size);

    return () => {
      dispatch(setPosts({ postData: [] }));
      dispatch(setPostsTotal({ totalOfPosts: 0 }));
      dispatch(setLoadingGetPosts({ getAllPostsLoading: true }));
      dispatch(setIsAddPosting({ isSuccessPosting: false }));
    };
  }, [postAddNewPostingStatus, size, dispatch]);

  return (
    <Fragment>
      <ShareBox />
      {isPostsloading ? (
        <LoadingPosts />
      ) : (
        <Fragment>
          {filteredPosts.length ? (
            <Fragment>
              {filteredPosts.map((post) => (
                <Post key={post.id} postedData={post} />
              ))}

              {size < totalPostFromApi && (
                <GlobalButton
                  buttonLabel="See More"
                  classStyleName="see-more-button"
                  onClick={handleSeeMore}
                  loading={loadingSeeMore}
                  renderLabel={({ label, isLoading }) =>
                    !isLoading ? (
                      <div>{label}</div>
                    ) : (
                      <RoundedLoader baseColor="gray" secondaryColor="white" />
                    )
                  }
                />
              )}
            </Fragment>
          ) : (
            <EmptyStatePosts
              params={{ ...paramsEmptyState, location: "home-page" }}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
