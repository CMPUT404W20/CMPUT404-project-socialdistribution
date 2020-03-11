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

export const createPost = () => {
  return null;
};
