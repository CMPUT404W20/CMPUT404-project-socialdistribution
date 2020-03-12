/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import axios from "axios";

export const createComment = (newComment, postId) => {
  return axios.post(`posts/${postId}/comments/`, {
    comment: newComment,
  });
};

export const getComment = () => {
  return null;
};
