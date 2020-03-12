/* eslint-disable arrow-body-style */
import axios from "axios";

export const getPosts = () => {
  return axios.get("/author/posts").then((response) => {
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
  return axios.get(`/author/${fullUserId}/posts`).then((response) => {
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
  return axios.post("/author/posts", postData).then((response) => {
    if (response.status === 201) {
      return;
    }

    throw new Error("Unable to create post");
  });
};