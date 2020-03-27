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

export const getAuthorFriendRequests = () => {
  return axios.get("/friendrequest").then((response) => {
    if (response.status === 200) {
      if (response.data) {
        return response.data;
      }
      return {};
    }

    throw new Error("Unable to retrieve friends");
  });
};

export const checkFriendStatus = (authorId1, authorId2) => {
  return axios.get(`/author/${authorId1}/friends/${authorId2}`).then((response) => {
    if (response.status === 200) {
      return response.data.friends;
    }
    return false;
  });
};

// for eslint
export const createFriend = () => {
  return null;
};
