/* eslint-disable arrow-body-style */
import axios from "axios";

export const createComment = (newComment) => {
  return axios.post("posts/<uuid:postId>/comments", {
    comment: newComment,
  });
};

export const getComment = () => {
  return null;
};
