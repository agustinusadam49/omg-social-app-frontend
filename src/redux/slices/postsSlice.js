import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    postsByUserId: [],
    postsTotal: 0,
    postsTotalByUserId: 0,
    isAddPosting: false,
    loadingGetPosts: true,
    loadingGetPostsByUserId: true,
    searchPostsTerms: "",
    isPostModalEditOpen: false,
    statusPost: "",
    postItem: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.postData;
    },
    setPostsByUserId: (state, action) => {
      state.postsByUserId = action.payload.postDataByUserId;
    },
    setPostsTotal: (state, action) => {
      state.postsTotal = action.payload.totalOfPosts;
    },
    setPostsTotalByUserId: (state, action) => {
      state.postsTotalByUserId = action.payload.totalOfPostsByUserId;
    },
    setIsAddPosting: (state, action) => {
      state.isAddPosting = action.payload.isSuccessPosting;
    },
    setLoadingGetPosts: (state, action) => {
      state.loadingGetPosts = action.payload.getAllPostsLoading;
    },
    setLoadingGetPostsById: (state, action) => {
      state.loadingGetPostsByUserId = action.payload.getAllPostsByUserIdLoading;
    },
    setSearchPostsTerms: (state, action) => {
      state.searchPostsTerms = action.payload.getSearchTermsForPosts;
    },
    setIsPostModalEditOpen: (state, action) => {
      state.isPostModalEditOpen = action.payload.isPostModalEditOpen;
    },
    setStatusPost: (state, action) => {
      state.statusPost = action.payload.statusPost;
    },
    setPostItem: (state, action) => {
      state.postItem = action.payload.postItem;
    },
  },
});

export const {
  setPosts,
  setPostsByUserId,
  setPostsTotal,
  setPostsTotalByUserId,
  setIsAddPosting,
  setLoadingGetPosts,
  setLoadingGetPostsById,
  setSearchPostsTerms,
  setIsPostModalEditOpen,
  setStatusPost,
  setPostItem,
} = postsSlice.actions;

export default postsSlice.reducer;
