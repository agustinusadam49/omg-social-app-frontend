import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import postsReducer from "./slices/postsSlice";
import commentsReducer from "./slices/commentsSlice";
import notificationReducer from "./slices/notificationSlice";
import buttonsReducer from "./slices/buttonsSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    comments: commentsReducer,
    notifications: notificationReducer,
    button: buttonsReducer,
  },
});
