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
        // eslint-disable-next-line no-alert
          this.setState({ isAuthed: true, isLoading: false });
        }
      }));
    this.setState({ isLoading: false });
  }

  render() {
    const { isAuthed, isLoading } = this.state;
    return (
      !isLoading && (
      <Route
        exact
        path="/"
        render={() => (isAuthed ? (
          <Redirect to={{ pathname: "/home" }} />
        ) : (
          <Login />
        ))}
      />
      )
    );
  }
}

export default PrivateRoute;
