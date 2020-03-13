/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

export const createComment = (newComment, postId) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  // eslint-disable-next-line object-shorthand
  return axios.post(`posts/${postId}/comments/`, { 
    query: "addComment",
    comment: newComment,
  }, { headers }).then((response) => {
    if (response.status === 201) {
      return response.data.success;
    }

    throw new Error("Unable to create comment");
  });
};

export const getComment = () => {
  return null;
};
