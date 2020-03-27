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
      id: "cc9a7316-601f-437e-9708-18025b7e0d23",
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
