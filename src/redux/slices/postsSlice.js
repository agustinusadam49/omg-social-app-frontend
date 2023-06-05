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
    searchPostsTerms: '',
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
      state.searchPostsTerms = action.payload.getSearchTermsForPosts
    }
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
} = postsSlice.actions;

export default postsSlice.reducer;
