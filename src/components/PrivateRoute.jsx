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
  //   axios.get("/auth/user", { headers: { "WWW-Authenticate":
  // "xxx", Authorization: "BasicCustom", "X-Requested-With": "XMLHttpRequest" } }).
  // then(((response) => {
  //     if (response.status === 200) {
  //       // TODO: success: redirect to homepage
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
        render={(props) => (isAuthed ? (
          <Redirect to={{ pathname: "/home" }} />
        ) : (
          <Login {...props} />
        ))}
      />
    );
  }
}

export default PrivateRoute;
