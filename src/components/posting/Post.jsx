import React, { useState, useEffect, useMemo } from "react";
import Comments from "../comment/Comments";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { rangeDay } from "../../utils/rangeDay";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import {
  useSelector,
  // useDispatch,
} from "react-redux";
import { deleteLikeById, addNewLike } from "../../apiCalls/likesApiFetch";
import { getAllCommentsDataByPostId } from "../../apiCalls/commentsApiFetch";
// import { setIsAddPosting } from "../../redux/slices/postsSlice";
import { Link } from "react-router-dom";
import { accessToken } from "../../utils/getLocalStorage";
import { displayUserWhoLikesThisPost } from "../../utils/postLikes.js";
import "./Post.scss";

export default function Post({ postedData }) {
  // const dispatch = useDispatch();
  const thisPostId = postedData.id;
  const access_token = accessToken();
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const addNewPosting = useSelector((state) => state.comments.isAddNewComment);
  const [currentCommentByIdTotal, setCurrentCommentByIdTotal] = useState(0);
  const [postDataUserLiked, setPostDataUserLiked] = useState([]);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [totalPostLike, setTotalPostLike] = useState(postedData.Likes.length);
  const [postedDataLikes, setPostedDataLikes] = useState([]);
  const calculatedLikeTotal = useMemo(() => totalPostLike, [totalPostLike]);
  const mappedPostedDataLikes = useMemo(() => postedDataLikes, [postedDataLikes]);

  // const postDataUserLiked = useMemo(
  //   () =>
  //     postedData.Likes.filter((item) => item.UserId === currentUserIdFromSlice),
  //   [postedData, currentUserIdFromSlice]
  // );

  const toggleCommentHandler = (statusValue) => {
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
    addNewLike(access_token, payloadDataAddLike)
      .then((newLikeResponseData) => {
        if (newLikeResponseData.data.success) {
          // dispatch(setIsAddPosting({ isSuccessPosting: true }));
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
          setPostedDataLikes((oldArray) => [...oldArray, newLikePayload])
        }
      })
      .catch((error) => {
        const errorAddNewLike = error.response;
        console.log("hitAddNewLikeApi", errorAddNewLike);
      });
  };

  const hitDeleteLikeByIdApi = (idOfThisLike) => {
    deleteLikeById(access_token, idOfThisLike)
      .then((deleteLikeByIdResponse) => {
        if (deleteLikeByIdResponse.data.success) {
          // dispatch(setIsAddPosting({ isSuccessPosting: true }));
          setPostDataUserLiked([]);
          setTotalPostLike((prevVal) => prevVal - 1);
          const filteredLikesData = mappedPostedDataLikes.filter((like) => like.id !== idOfThisLike)
          setPostedDataLikes(filteredLikesData)
        }
      })
      .catch((error) => {
        const errorDeleteLikeById = error.response;
        console.log("hitDeleteLikeByIdApi", errorDeleteLikeById);
      });
  };

  const getDataCommentsByIdEachPosting = (user_token, this_post_id) => {
    getAllCommentsDataByPostId(user_token, this_post_id)
      .then((commentByPostId) => {
        const commentsByPostIdTotal =
          commentByPostId.data.totalCommentsByPostId;
        if (commentsByPostIdTotal > 0) {
          setCurrentCommentByIdTotal(commentsByPostIdTotal);
        } else {
          setCurrentCommentByIdTotal(0);
        }
      })
      .catch((error) => {
        console.log("cannot get comment by post id from Post component", error);
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
  }, [postedData, currentUserIdFromSlice]);

  useEffect(() => {
    if (access_token) getDataCommentsByIdEachPosting(access_token, thisPostId);
  }, [access_token, thisPostId, addNewPosting, isCommentSectionOpen]);

  return (
    <div className="post">
      <div className="post-wrapper">
        <div className="post-top">
          <div className="post-top-left">
            <Link
              to={`/profile/${postedData.User.userName}/user-id/${postedData.UserId}`}
            >
              <img
                src={postedData.User.Profile.avatarUrl}
                alt="user-pict-profile"
                className="post-profile-img"
              />
            </Link>
            <Link
              to={`/profile/${postedData.User.userName}/user-id/${postedData.UserId}`}
              style={{ textDecoration: "none", color: "black" }}
              className="post-username"
            >
              {postedData.User.userName}
            </Link>
            <span className="post-date">{rangeDay(postedData.createdAt)}</span>
          </div>

          <div className="post-top-right">
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
              {currentCommentByIdTotal} comments
            </span>
          </div>
        </div>

        {isCommentSectionOpen && (
          <Comments postId={postedData.id} postUserId={postedData.User.id} />
        )}
      </div>
    </div>
  );
}
