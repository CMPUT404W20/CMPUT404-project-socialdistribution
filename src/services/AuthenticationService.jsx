/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */
import axios from "axios";
import Cookies from "js-cookie";

export const loginUser = (username, password) => {
  return axios.post("/auth/login/", {
    username,
    password,
  });
};

export const registerUser = (username, password) => {
  return axios.post("/auth/registration/", {
    username,
    password1: password,
    password2: password,
  });
};

export const getCurrentUser = () => {
  return axios.get("/author/current/");
};

export const logoutUser = () => {
  const csrf = Cookies.get("csrftoken");
  const headers = {
    "X-CSRFToken": csrf,
  };

  return axios.post("/auth/logout/", null, { headers: headers });
};
