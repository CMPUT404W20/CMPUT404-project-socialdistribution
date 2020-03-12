/* eslint-disable arrow-body-style */
import axios from "axios";

export const getAuthorFriends = (authorId) => {
  return axios.get(`/author/${authorId}`).then((response) => {
    if (response.status === 200) {
      if (response.data && response.data.friends) {
        return response.data.friends;
      }
      return {};
    }

    throw new Error("Unable to retrieve friends");
  });
};

export const createFriend = () => {
  return null;
};
