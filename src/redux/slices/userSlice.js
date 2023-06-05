import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUsers: {},
    allUsers: [],
    userName: "",
    userToken: "",
    userId: "",
    userProfilePicture: "",
    userAvatarPicture: "",
    userBiodata: "",
    isUserAuthenticated: false,
    snapUserLogout: false,
    isUserSuggestionModalOpen: false,
    isUserOnlineModalOpen: false,
  },
  reducers: {
    setCurrentUsers: (state, action) => {
      state.currentUsers = action.payload.currentUsersData
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload.registeredUsers
    },
    setIsAuthUser: (state, action) => {
      state.isUserAuthenticated = action.payload.isAuth;
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload.currentUserToken;
    },
    setUserName: (state, action) => {
      state.userName = action.payload.currentUserName;
    },
    setUserId: (state, action) => {
      state.userId = action.payload.currentUserId;
    },
    setUserProfilePicture: (state, action) => {
      state.userProfilePicture = action.payload.userProfile;
    },
    setUserAvatarPicture: (state, action) => {
      state.userAvatarPicture = action.payload.userAvatar;
    },
    setUserBiodata: (state, action) => {
      state.userBiodata = action.payload.shortBio;
    },
    setSnapUserLogout: (state, action) => {
      state.snapUserLogout = action.payload.isUserLogout
    },
    setIsUserSuggestionModalOpen: (state, action) => {
      state.isUserSuggestionModalOpen = action.payload.isSuggestionModalOpen
    },
    setIsUserOnlineModalOpen: (state, action) => {
      state.isUserOnlineModalOpen = action.payload.isUserOnlineModalOpen
    },
  },
});

export const {
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
  setIsUserSuggestionModalOpen,
  setIsUserOnlineModalOpen,
} = userSlice.actions;

export default userSlice.reducer;
