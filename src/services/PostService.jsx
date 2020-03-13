/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

export const getPosts = () => {
  return axios.get("/author/posts/").then((response) => {
    if (response.status === 200) {
      if (response.data && response.data.posts) {
        return response.data;
      }
      return {};
    }

    throw new Error("Unable to retrieve posts");
  });
};

export const getUserPosts = (fullUserId) => {
  return axios.get(`/author/${fullUserId}/posts/`).then((response) => {
    if (response.status === 200) {
      if (response.data && response.data.posts) {
        return response.data;
      }
      return {};
    }

    throw new Error("Unable to retrieve posts");
  });
};

export const createUserPosts = (postData) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  // eslint-disable-next-line object-shorthand
  return axios.post("/author/posts/", postData, { headers: headers }).then((response) => {
    if (response.status === 201) {
      return response.data.success;
    }

    throw new Error("Unable to create post");
  });
};

export const deleteUserPosts = (postId) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  return axios.delete(`/posts/${postId}/`, { headers: headers }).then((response) => {
    if (response.status === 204) {
      return {};
    }

    throw new Error("Unable to delete posts");
  });
};

export const updateUserPosts = (post) => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  return axios.put(`/posts/${post.id}/`, post, { headers: headers }).then((response) => {
    if (response.status === 200) {
      return {};
    }

    throw new Error("Unable to update posts");
  });
};

