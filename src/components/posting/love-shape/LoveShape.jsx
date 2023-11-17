import React, { Fragment, useReducer, useState, useEffect } from "react";
import RoundedLoader from "../../rounded-loader/RoundedLoader";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { deleteLikeById, addNewLike } from "../../../apiCalls/likesApiFetch";
import { useSelector } from "react-redux";

import "./LoveShape.scss";

const INITIAL_LIKE_STATE = {
  loading: false,
};

const actionType = {
  LIKE_OR_UNLIKE: "LIKE_OR_UNLIKE",
  FINISH_LIKE_OR_UNLIKE: "FINISH_LIKE_OR_UNLIKE",
};

const likeReducer = (state, action) => {
  switch (action.type) {
    case "LIKE_OR_UNLIKE": {
      return {
        ...state,
        loading: true,
      };
    }
    case "FINISH_LIKE_OR_UNLIKE": {
      return {
        ...state,
        loading: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

export default function LoveShape({
  postedData,
  mappedPostedDataLikes,
  setTotalPostLike,
  setPostedDataLikes,
}) {
  const [likeState, mutate] = useReducer(likeReducer, INITIAL_LIKE_STATE);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const [postDataUserLiked, setPostDataUserLiked] = useState([]);

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
    mutate({ type: actionType.LIKE_OR_UNLIKE });
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
          mutate({ type: actionType.FINISH_LIKE_OR_UNLIKE });
        }
      })
      .catch((error) => {
        const errorAddNewLike = error.response;
        console.log("hitAddNewLikeApi", errorAddNewLike);
        mutate({ type: actionType.FINISH_LIKE_OR_UNLIKE });
      });
  };

  const hitDeleteLikeByIdApi = (idOfThisLike) => {
    mutate({ type: actionType.LIKE_OR_UNLIKE });
    deleteLikeById(idOfThisLike)
      .then((deleteLikeByIdResponse) => {
        if (deleteLikeByIdResponse.data.success) {
          setPostDataUserLiked([]);
          setTotalPostLike((prevVal) => prevVal - 1);
          const filteredLikesData = mappedPostedDataLikes.filter(
            (like) => like.id !== idOfThisLike
          );
          setPostedDataLikes(filteredLikesData);
          mutate({ type: actionType.FINISH_LIKE_OR_UNLIKE });
        }
      })
      .catch((error) => {
        const errorDeleteLikeById = error.response;
        console.log("hitDeleteLikeByIdApi", errorDeleteLikeById);
        mutate({ type: actionType.FINISH_LIKE_OR_UNLIKE });
      });
  };

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
    };
  }, [postedData, currentUserIdFromSlice]);

  if (likeState.loading) {
    return (
      <RoundedLoader
        baseColor="rgb(251, 226, 226)"
        secondaryColor="rgb(234, 84, 84)"
      />
    );
  }

  return (
    <Fragment>
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
    </Fragment>
  );
}
