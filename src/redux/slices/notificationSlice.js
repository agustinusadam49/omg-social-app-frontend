import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    followerNotif: [],
    messageNotif: [],
    postNotif: [],
  },
  reducers: {
    setFollowerNotif: (state, action) => {
      state.followerNotif = action.payload.followerNotifData;
    },
    setMessageNotif: (state, action) => {
      state.messageNotif = action.payload.messageNotifData;
    },
    setPostNotif: (state, action) => {
      state.postNotif = action.payload.postNotifData;
    },
  },
});

export const { setFollowerNotif, setMessageNotif, setPostNotif } = notificationSlice.actions;
export default notificationSlice.reducer;
