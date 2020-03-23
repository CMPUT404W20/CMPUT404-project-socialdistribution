import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import Login from "./Login";
import * as auth from "../services/AuthenticationService";

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthed: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    auth.getCurrentUser()
      .then(((response) => {
        if (response.status === 200) {
          localStorage.setItem("userID", response.data.id);
          localStorage.setItem("username", response.data.displayName);
          this.setState({ isAuthed: true, isLoading: false });
        }
      }));
    this.setState({ isLoading: false });
  }

  render() {
    const { isAuthed, isLoading } = this.state;
    return (
      !isLoading && (
        (isAuthed ? (
          <Redirect to={{ pathname: "/home" }} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        ))
      )
    );
  }
}

export default PrivateRoute;
