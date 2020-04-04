/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

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

export const checkFollowingStatus = (authorId) => {
  return axios.get(`/following/${authorId}`).then((response) => {
    if (response.status === 200) {
      return response.data.following;
    }
    return false;
  });
};

export const unFriend = (friend) => {
  const payload = {
    query: "unfriend",
    friend,
  };
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };
  // eslint-disable-next-line object-shorthand
  return axios.post("/friend/unfriend/", payload, { headers }).then((response) => {
    if (response.status === 200) {
      return response.data.success;
    }
    throw new Error("Unable to send friend request");
  });
};

export const sendFriendRequest = (author, friend) => {
  const payload = {
    query: "friendrequest",
    author,
    friend,
  };
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };
  // eslint-disable-next-line object-shorthand
  return axios.post("/friendrequest", payload, { headers }).then((response) => {
    if (response.status === 201) {
      return response.data.success;
    }
    throw new Error("Unable to send friend request");
  });
};

export const rejectFriendRequest = (author, friend) => {
  const payload = {
    query: "friendrequest",
    author,
    friend,
  };
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };
  // eslint-disable-next-line object-shorthand
  return axios.post("/friendrequest/reject/", payload, { headers }).then((response) => {
    if (response.status === 204) {
      return true;
    }
    throw new Error("Unable to send friend request");
  });
};

export const searchAuthors = (displayName) => {
  return axios.get(`/author/search/${displayName}`).then((response) => {
    if (response.status === 200) {
      return response.data.authors;
    }
    return {};
  });
};

export const getAllAuthors = () => {
  return axios.get("/author/all/").then((response) => {
    if (response.status === 200) {
      return response.data;
    }

    return [];
  });
};

// for eslint
export const createFriend = () => {
  return null;
};
