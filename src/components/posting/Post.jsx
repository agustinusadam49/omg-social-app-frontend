import React, { useState, useEffect, useMemo } from "react";
import Comments from "../comment/Comments";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { rangeDay } from "../../utils/rangeDay";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import { useSelector } from "react-redux";
import { deleteLikeById, addNewLike } from "../../apiCalls/likesApiFetch";
import { getAllCommentsDataByPostId } from "../../apiCalls/commentsApiFetch";
import { Link } from "react-router-dom";
import { displayUserWhoLikesThisPost } from "../../utils/postLikes.js";
import "./Post.scss";

export default function Post({ postedData }) {
  const thisPostId = postedData.id;
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const addNewPosting = useSelector((state) => state.comments.isAddNewComment);
  const [currentCommentByIdTotal, setCurrentCommentByIdTotal] = useState(0);
  const [postDataUserLiked, setPostDataUserLiked] = useState([]);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [totalPostLike, setTotalPostLike] = useState(postedData.Likes.length);
  const [postedDataLikes, setPostedDataLikes] = useState([]);
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const calculatedLikeTotal = useMemo(() => totalPostLike, [totalPostLike]);
  const mappedPostedDataLikes = useMemo(
    () => postedDataLikes,
    [postedDataLikes]
  );

  const displayWordingComments = () => {
    if (isLoadingComment) {
      return 'Loading ...'
    }

    return `${currentCommentByIdTotal} comments`
  }

  const getStatus = (statusFromResponse) => {
    const followersOnlyWording =
      postedData.UserId === currentUserIdFromSlice
        ? "Me & My Followers Only"
        : "Her/His's Followers Only";
    const POST_STATUS_ENUM = {
      PUBLIC: "Public",
      PRIVATE: "Private",
      FOLLOWERS_ONLY: followersOnlyWording,
    };

    return POST_STATUS_ENUM[statusFromResponse];
  };

  const toggleCommentHandler = (statusValue) => {
    if (isLoadingComment === true) return
    setIsCommentSectionOpen(statusValue);
  };

  const getPostId = (postData) => {
    return postData[0].id;
  };

  const likeHandler = () => {
    if (postDataUserLiked.length) {
      const postId = getPostId(postDataUserLiked);
      hitDeleteLikeByIdApi(postId);
    } else {
      hitAddNewLikeApi();
    }
  };

  const hitAddNewLikeApi = () => {
    const postId = postedData.id;
    const payloadDataAddLike = { PostId: postId };
    addNewLike(payloadDataAddLike)
      .then((newLikeResponseData) => {
        if (newLikeResponseData.data.success) {
          const newLikeData = newLikeResponseData.data.newLike;
          const newLikeObj = {
            id: newLikeData.id,
            PostId: newLikeData.PostId,
            UserId: newLikeData.UserId,
          };

          const newLikePayload = {
            id: newLikeData.id,
            PostId: newLikeData.PostId,
            UserId: newLikeData.UserId,
            createdAt: newLikeData.createdAt,
            updatedAt: newLikeData.updatedAt,
            userName: "Anda",
          };
          setPostDataUserLiked((oldArray) => [...oldArray, newLikeObj]);
          setTotalPostLike((prevVal) => prevVal + 1);
          setPostedDataLikes((oldArray) => [...oldArray, newLikePayload]);
        }
      })
      .catch((error) => {
        const errorAddNewLike = error.response;
        console.log("hitAddNewLikeApi", errorAddNewLike);
      });
  };

  const hitDeleteLikeByIdApi = (idOfThisLike) => {
    deleteLikeById(idOfThisLike)
      .then((deleteLikeByIdResponse) => {
        if (deleteLikeByIdResponse.data.success) {
          setPostDataUserLiked([]);
          setTotalPostLike((prevVal) => prevVal - 1);
          const filteredLikesData = mappedPostedDataLikes.filter(
            (like) => like.id !== idOfThisLike
          );
          setPostedDataLikes(filteredLikesData);
        }
      })
      .catch((error) => {
        const errorDeleteLikeById = error.response;
        console.log("hitDeleteLikeByIdApi", errorDeleteLikeById);
      });
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
    const currentUserLikeThisPost = postedData.Likes.filter(
      (item) => item.UserId === currentUserIdFromSlice
    ).map((like) => ({
      id: like.id,
      PostId: like.PostId,
      UserId: like.UserId,
    }));
    setPostDataUserLiked(currentUserLikeThisPost);

    return () => {
      setPostDataUserLiked([]);
    }
  }, [postedData, currentUserIdFromSlice]);

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
          console.log(
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
  }, [
    thisPostId,
    addNewPosting,
    isCommentSectionOpen
  ]);

  return (
    <div className="post">
      <div className="post-wrapper">
        <div className="post-top">
          <div className="post-top-left">
            <Link
              to={`/profile/${postedData.User.userName}/user-id/${postedData.UserId}`}
              className="post-profile-img-link-wrapper"
            >
              <img
                src={postedData.User.Profile.avatarUrl}
                alt="user-pict-profile"
                className="post-profile-img"
              />
            </Link>

            <div className="post-top-left-username-and-date-wrapper">
              <Link
                to={`/profile/${postedData.User.userName}/user-id/${postedData.UserId}`}
                style={{ textDecoration: "none", color: "black" }}
                className="post-username"
              >
                {postedData.User.userName}
              </Link>

              <div className="post-date-and-status-wrapper">
                <div className="post-date">
                  {rangeDay(postedData.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="post-top-right">
            <div
              className={`post-status ${
                postedData.status === "PUBLIC"
                  ? "public"
                  : postedData.status === "PRIVATE"
                  ? "private"
                  : "followers-only"
              }`}
            >
              {getStatus(postedData.status)}
            </div>
            <MoreVertIcon style={{ cursor: "pointer" }} />
          </div>
        </div>

        <div className="post-middle">
          {postedData?.postCaption ? (
            <div className="post-middle-text">{postedData.postCaption}</div>
          ) : (
            ""
          )}

          {postedData?.postImageUrl ? (
            <img
              src={postedData.postImageUrl}
              alt="user-post-pict"
              className="post-img"
            />
          ) : (
            ""
          )}
        </div>

        {postedData.status !== "PRIVATE" && (
          <div className="post-bottom">
            <div className="post-bottom-left">
              {postDataUserLiked.length ? (
                <FavoriteSharpIcon
                  style={{ color: "red" }}
                  className="like-and-heart-icon"
                  onClick={likeHandler}
                />
              ) : (
                <FavoriteBorderSharpIcon
                  style={{ color: "red" }}
                  className="like-and-heart-icon"
                  onClick={likeHandler}
                />
              )}

              <span className="post-like-counter">
                {calculatedLikeTotal},{" "}
                {displayUserWhoLikesThisPost(
                  mappedPostedDataLikes,
                  currentUserIdFromSlice
                )}
              </span>
            </div>

            <div className="post-bottom-right">
              <span
                className="post-comment-text"
                onClick={() => toggleCommentHandler(!isCommentSectionOpen)}
              >
                {displayWordingComments()}
              </span>
            </div>
          </div>
        )}

        {isCommentSectionOpen && (
          <Comments postId={postedData.id} postUserId={postedData.User.id} />
        )}
      </div>
    </div>
  );
}
