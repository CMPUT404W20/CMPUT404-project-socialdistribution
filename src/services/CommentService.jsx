/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

export const createComment = (newComment) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  // eslint-disable-next-line object-shorthand
  return axios.post(`posts/${newComment.post}/comments/`, newComment, { headers }).then((response) => {
    if (response.status === 201) {
      return response;
    }
    throw new Error("Unable to create comment");
  });
};

export const getComment = () => {
  return null;
};
