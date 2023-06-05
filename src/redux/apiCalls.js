import { setToLocalStorageWhenSuccess } from "../utils/setLocalStorage";

// IMPORT API METHOD FOR USER
import {
  getCurrentUserLogin,
  getAllUsersOmonginApp,
  userLogout,
} from "../apiCalls/registerAndLoginApiFetch";

// IMPORT API METHOD FOR POSTS
import { getAllPosts } from "../apiCalls/postsApiFetch";

// IMPORT API METHOD FOR NOTIFICATIONS
import { getAllNotificationsOfCurrentUser } from "../apiCalls/notificationsApiFetch";

// IMPORT USER SLICE SETTER
import {
  setCurrentUsers,
  setIsAuthUser,
  setUserToken,
  setUserName,
  setUserId,
  setUserProfilePicture,
  setUserAvatarPicture,
  setAllUsers,
  setSnapUserLogout,
  setUserBiodata,
} from "./slices/userSlice";

// IMPORT POSTS SLICE SETTER
import {
  setPosts,
  setPostsByUserId,
  setPostsTotal,
  setPostsTotalByUserId,
  setIsAddPosting,
  setLoadingGetPosts,
  setLoadingGetPostsById,
} from "./slices/postsSlice";

// IMPORT NOTIFICATIONS SLICE SETTER
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "./slices/notificationSlice";

// USER API CALLS
export const userInfoLogin = (accessTokenUser, dispatch) => {
  getCurrentUserLogin(accessTokenUser)
    .then((currentUserLoginData) => {
      const dataUser = currentUserLoginData.data.users;
      const userNameFromData = currentUserLoginData.data.user_name;
      const userIdFromData = currentUserLoginData.data.user_id;
      const userTokenFromData = currentUserLoginData.data.user_token;
      dispatch(setUserToken({ currentUserToken: userTokenFromData }));
      setToLocalStorageWhenSuccess(
        userTokenFromData,
        userNameFromData,
        userIdFromData
      );
      dispatch(setCurrentUsers({ currentUsersData: dataUser }));
      dispatch(setIsAuthUser({ isAuth: true }));
      dispatch(setUserName({ currentUserName: userNameFromData }));
      dispatch(setUserId({ currentUserId: userIdFromData }));
      dispatch(
        setUserProfilePicture({ userProfile: dataUser.profile.profileCoverUrl })
      );
      dispatch(
        setUserAvatarPicture({ userAvatar: dataUser.profile.avatarUrl })
      );
      dispatch(setUserBiodata({ shortBio: dataUser.profile.biodata }));
    })
    .catch((error) => {
      const errorCommonMessage = error?.response?.data?.err?.errorMessage;
      if (errorCommonMessage) {
        console.log(error.response?.data.err.message);
      } else {
        console.log(error.response?.data.errorMessage);
      }
      dispatch(setIsAuthUser({ isAuth: false }));
    });
};

export const getAllUsersRegistered = (accessTokenUser, dispatch) => {
  getAllUsersOmonginApp(accessTokenUser)
    .then((allUsersRegistered) => {
      const dataUser = allUsersRegistered.data.userData;
      dispatch(setAllUsers({ registeredUsers: dataUser }));
      dispatch(setSnapUserLogout({ isUserLogout: false }));
    })
    .catch((error) => {
      const errorCommonMessage = error?.response?.data?.err?.errorMessage;
      if (errorCommonMessage) {
        console.log(error.response?.data.err.message);
      } else {
        console.log(error.response?.data.errorMessage);
      }
    });
};

export const doUserLogout = (userId, dispatch) => {
  const requestBodyForUpdateOnlineStatus = { userOnlineStatus: false };
  userLogout(userId, requestBodyForUpdateOnlineStatus)
    .then((userLoginStatusResult) => {
      if (userLoginStatusResult.data.success) {
        localStorage.clear();
        dispatch(setIsAuthUser({ isAuth: false }));
        dispatch(setSnapUserLogout({ isUserLogout: true }));
      }
    })
    .catch((error) => {
      console.log(error?.response?.data?.err?.errorMessage);
    });
};

// POSTS API CALLS
export const getPostsAvailable = (accessTokenUser, dispatch) => {
  dispatch(setLoadingGetPosts({ getAllPostsLoading: true }));
  getAllPosts(accessTokenUser)
    .then((posts) => {
      const { totalPosts } = posts.data;

      if (totalPosts) {
        setTimeout(() => {
          dispatch(setPostsTotal({ totalOfPosts: posts.data.totalPosts }));
          dispatch(setPosts({ postData: posts.data.posts }));
          dispatch(setIsAddPosting({ isSuccessPosting: false }));
          dispatch(setLoadingGetPosts({ getAllPostsLoading: false }));
        }, 1000);
      } else {
        dispatch(setPostsTotal({ totalOfPosts: 0 }));
        setTimeout(() => {
          dispatch(setLoadingGetPosts({ getAllPostsLoading: false }));
        }, 1000);
      }
    })
    .catch((error) => {
      console.error("error getPostsAvailable", error.message);
      dispatch(setPostsTotal({ totalOfPosts: 0 }));

      setTimeout(() => {
        dispatch(setLoadingGetPosts({ getAllPostsLoading: false }));
      }, 1000);
    });
};

// POSTS API CALLS BY USER ID
export const getPostsAvailableByUserId = (
  accessTokenUser,
  userIdParam,
  dispatch
) => {
  dispatch(setLoadingGetPostsById({ getAllPostsByUserIdLoading: true }));
  getAllPosts(accessTokenUser)
    .then((posts) => {
      setTimeout(() => {
        const { totalPosts } = posts.data;
        const dataPostAll = posts.data.posts;

        if (totalPosts) {
          const dataPostByUserId = dataPostAll.filter(
            (post) => post.UserId === userIdParam
          );
          dispatch(setPostsByUserId({ postDataByUserId: dataPostByUserId }));
          dispatch(
            setPostsTotalByUserId({
              totalOfPostsByUserId: dataPostByUserId.length,
            })
          );
          dispatch(setIsAddPosting({ isSuccessPosting: false }));
          dispatch(
            setLoadingGetPostsById({ getAllPostsByUserIdLoading: false })
          );
        } else {
          dispatch(setPostsTotalByUserId({ totalOfPostsByUserId: 0 }));
          dispatch(
            setLoadingGetPostsById({ getAllPostsByUserIdLoading: false })
          );
        }
      }, 1000);
    })
    .catch((error) => {
      console.error("error getPostsAvailableByUserId", error);
      dispatch(setPostsTotalByUserId({ totalOfPostsByUserId: 0 }));

      setTimeout(() => {
        dispatch(setLoadingGetPostsById({ getAllPostsByUserIdLoading: false }));
      }, 1000);
    });
};

// NOTIFICATIONS BELONGS TO LOGGED IN USER API CALL
export const getNotificationsBelongsToLoggedUser = (
  userAccessToken,
  dispatch
) => {
  getAllNotificationsOfCurrentUser(userAccessToken)
    .then((notificationsResult) => {
      const { totalNotif } = notificationsResult.data;
      const notifications = notificationsResult.data.notifications;

      const followsFiltered = notifications.filter(
        (item) => item.type === "Follows"
      );
      const messagesFiltered = notifications.filter(
        (item) => item.type === "Messages"
      );
      const postsFiltered = notifications.filter(
        (item) => item.type === "Posts"
      );

      if (totalNotif) {
        dispatch(setFollowerNotif({ followerNotifData: followsFiltered }));
        dispatch(setMessageNotif({ messageNotifData: messagesFiltered }));
        dispatch(setPostNotif({ postNotifData: postsFiltered }));
      } else {
        dispatch(setFollowerNotif({ followerNotifData: [] }));
        dispatch(setMessageNotif({ messageNotifData: [] }));
        dispatch(setPostNotif({ postNotifData: [] }));
      }
    })
    .catch((error) => {
      const notifErrorMessages = error?.response?.data?.err?.errorMessage;
      if (notifErrorMessages) {
        dispatch(setFollowerNotif({ followerNotifData: [] }));
        dispatch(setMessageNotif({ messageNotifData: [] }));
        dispatch(setPostNotif({ postNotifData: [] }));
      }
    });
};
