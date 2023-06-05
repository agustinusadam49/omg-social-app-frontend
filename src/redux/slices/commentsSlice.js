import { createSlice } from '@reduxjs/toolkit'

export const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
      allComments: [],
      allRepliesByCommentId: [],
      commentsByPostId: [],
      allCommentsTotal: 0,
      commentsByPostIdTotal: 0,
      replyByCommentIdTotal: 0,
      isAddNewComment: false,
      isAddNewReplyComment: false,
    },
    reducers: {
      setAllComments: (state, action) => {
        state.allComments = action.payload.commentDataAll;
      },
      setAllRepliesByCommentId: (state, action) => {
        state.allRepliesByCommentId = action.payload.repliesByCommentId;
      },
      setCommentsByPostId: (state, action) => {
        state.commentsByPostId = action.payload.commentDataByPostId;
      },
      setCommentsTotal: (state, action) => {
        state.allCommentsTotal = action.payload.totalOfComments
      },
      setCommentsByPostIdTotal: (state, action) => {
        state.commentsByPostIdTotal = action.payload.totalOfCommentsByPostId
      },
      setReplyByCommentIdTotal: (state, action) => {
        state.replyByCommentIdTotal = action.payload.totalOfReplyByCommentId
      },
      setIsAddNewComment: (state, action) => {
        state.isAddNewComment = action.payload.successAddNewComment
      },
      setIsAddNewReplyComment: (state, action) => {
        state.isAddNewReplyComment = action.payload.successAddNewReplyComment
      }
    }
})

export const {
    setAllComments,
    setCommentsByPostId,
    setCommentsTotal,
    setCommentsByPostIdTotal,
    setIsAddNewComment,
    setAllRepliesByCommentId,
    setIsAddNewReplyComment,
    setReplyByCommentIdTotal
} = commentsSlice.actions;

export default commentsSlice.reducer;