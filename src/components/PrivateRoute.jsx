/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { userContext } from "../contexts/UserContext";

const PrivateRoute = ({
  component: Component, user: User, isAuthed: Authed, ...rest
}) => {
  // Add your own authentication on the below line.
  const authed = Authed;

  return (
    <Route
      {...rest}
      render={(props) => (authed ? (
        <userContext.Provider value={User}>
          <userContext.Consumer>
            {(user) => (<Component {...props} user={user} />)}
          </userContext.Consumer>
        </userContext.Provider>
      ) : (
        <Redirect to={{ pathname: "/login" }} />
      ))}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  user: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
  isAuthed: PropTypes.bool.isRequired,
};

export default PrivateRoute;
