import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import Login from "./Login";

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthed: false,
    };
  }
  // To do: Fix the 401 response header to disable popup auth

  // componentDidMount() {
  //   axios.get("/auth/user").
  // then(((response) => {
  //     if (response.status === 200) {
  //       // eslint-disable-next-line no-alert
  //       this.setState({ isAuthed: true });
  //     }
  //   }));
  // }

  render() {
    const { isAuthed } = this.state;
    return (
      <Route
        exact
        path="/"
        render={() => (isAuthed ? (
          <Redirect to={{ pathname: "/home" }} />
        ) : (
          <Login />
        ))}
      />
    );
  }
}

export default PrivateRoute;
