/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

export const getComment = () => {
  return null;
};

export const createComment = (source, postId, newComment, user) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };
  const payload = {
    query: "addComment",
    post: source,
    comment: {
      author: {
        id: user.id,
        host: user.host,
        displayName: user.displayName,
        url: user.url,
        github: user.github,
      },
      comment: newComment,
      contentType: "text/markdown",
      published: new Date().toISOString(),
      id: "",
    },
  };
  // eslint-disable-next-line object-shorthand
  return axios.post(`posts/${postId}/comments/`, payload, { headers }).then((response) => {
    if (response.status === 201) {
      return response.data.success;
    }
    throw new Error("Unable to create comment");
  });
};
