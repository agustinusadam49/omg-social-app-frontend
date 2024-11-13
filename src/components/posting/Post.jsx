import React, { useState, useEffect, useMemo, Fragment } from "react";
import Comments from "../comment/Comments";
import { useSelector, useDispatch } from "react-redux";
import { getAllCommentsDataByPostId } from "../../apiCalls/commentsApiFetch";
import PostContainer from "./post-container/PostContainer.jsx";
import PostWrapper from "./post-wrapper/PostWrapper.jsx";
import PostTopSection from "./post-top-section/PostTopSection.jsx";
import PostMiddleSection from "./post-middle-section/PostMiddleSection.jsx";
import PostBottomSection from "./post-bottom-section/PostBottomSection.jsx";
import LoveShape from "./love-shape/LoveShape.jsx";
import PostLikeCounter from "./post-like-counter/PostLikeCounter.jsx";
import PostCommentText from "./post-comment-text/PostCommentText.jsx";
import RepostIconSection from "./repost-icon-section/RepostIconSection.jsx";
import {
  setIsRepostModalOpen,
  setStatusPost,
  setPostItem,
} from "../../redux/slices/postsSlice.js";

export default function Post({ postedData, isRepost }) {
  const dispatch = useDispatch();

  const thisPostId = postedData.id;

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const addNewPosting = useSelector((state) => state.comments.isAddNewComment);

  const [currentCommentByIdTotal, setCurrentCommentByIdTotal] = useState(0);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [totalPostLike, setTotalPostLike] = useState(postedData.Likes.length);
  const [postedDataLikes, setPostedDataLikes] = useState([]);
  const [isLoadingComment, setIsLoadingComment] = useState(false);

  const calculatedLikeTotal = useMemo(() => totalPostLike, [totalPostLike]);

  const toggleCommentHandler = (statusValue) => {
    if (isLoadingComment === true) return;
    setIsCommentSectionOpen(statusValue);
  };

  const openModalRepost = (val) => {
    dispatch(setIsRepostModalOpen({ isRepostModalOpen: val }));
    dispatch(setStatusPost({ statusPost: postedData.status }));
    dispatch(setPostItem({ postItem: postedData }));
  };

  useEffect(() => {
    const mappedPostedLikesData = postedData.Likes.map((postData) => ({
      id: postData.id,
      PostId: postData.PostId,
      UserId: postData.UserId,
      createdAt: postData.createdAt,
      updatedAt: postData.updatedAt,
      userName: postData.User.userName,
    }));

    setPostedDataLikes(mappedPostedLikesData);

    return () => {
      setPostedDataLikes([]);
    };
  }, [postedData]);

  useEffect(() => {
    const getDataCommentsByIdEachPosting = (this_post_id) => {
      setIsLoadingComment(true);
      getAllCommentsDataByPostId(this_post_id)
        .then((commentByPostId) => {
          setIsLoadingComment(true);
          const commentsByPostIdTotal = commentByPostId.data.totalCommentsByPostId;

          if (commentsByPostIdTotal > 0) {
            setCurrentCommentByIdTotal(commentsByPostIdTotal);
          } else {
            setCurrentCommentByIdTotal(0);
          }

          setIsLoadingComment(false);
        })
        .catch((error) => {
          setIsLoadingComment(false);
          console.error(
            "cannot get comment by post id from Post component",
            error
          );
        });
    };

    getDataCommentsByIdEachPosting(thisPostId);

    return () => {
      setCurrentCommentByIdTotal(0);
      setIsLoadingComment(false);
    };
  }, [thisPostId, addNewPosting, isCommentSectionOpen]);

  return (
    <PostContainer>
      <PostWrapper>
        <PostTopSection
          userName={postedData.User.userName}
          userId={postedData.UserId}
          avatarUrl={postedData.User.Profile.avatarUrl}
          createdDate={postedData.createdAt}
          statusPost={postedData.status}
          postData={postedData}
          isRepost={isRepost}
        />

        <PostMiddleSection
          caption={postedData.postCaption}
          postImage={postedData.postImageUrl}
          dataPost={postedData}
        />

        {postedData.status !== "PRIVATE" && !isRepost && (
          <PostBottomSection
            leftContent={() => (
              <Fragment>
                <LoveShape
                  postedData={postedData}
                  mappedPostedDataLikes={postedDataLikes}
                  setTotalPostLike={setTotalPostLike}
                  setPostedDataLikes={setPostedDataLikes}
                />

                <PostLikeCounter
                  totalLikeCalculated={calculatedLikeTotal}
                  postedDataLikesMapped={postedDataLikes}
                  currentUserIdSlice={currentUserIdFromSlice}
                />
              </Fragment>
            )}
            rightContent={() => (
              <Fragment>
                <RepostIconSection
                  totalRepost={postedData.repostCounter}
                  onClick={() => openModalRepost(true)}
                />

                <PostCommentText
                  isCommentLoading={isLoadingComment}
                  currentCommentTotal={currentCommentByIdTotal}
                  onClick={() => toggleCommentHandler(!isCommentSectionOpen)}
                />
              </Fragment>
            )}
          />
        )}

        {isCommentSectionOpen && (
          <Comments postId={postedData.id} postUserId={postedData.User.id} />
        )}
      </PostWrapper>
    </PostContainer>
  );
}
