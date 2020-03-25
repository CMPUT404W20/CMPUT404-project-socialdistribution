/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

export const createComment = (postId, comment) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  const payload = {
    query: "addComment",
    post: postId,
    comment: {
      comment,
    },
  };

  // eslint-disable-next-line object-shorthand
  return axios.post(`posts/${postId}/comments`, payload, { headers }).then((response) => {
    if (response.status === 201) {
      return response.data.success;
    }
    throw new Error("Unable to create comment");
  });
};

export const getComment = () => {
  return null;
};
