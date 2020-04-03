/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { userContext } from "../contexts/UserContext";

const PrivateRoute = ({
  component: Component, currentUser: User, isAuthed: Authed, ...rest
}) => {
  const authed = Authed;
  return (
    <Route
      {...rest}
      render={(props) => (authed ? (
        <userContext.Provider value={User}>
          <userContext.Consumer>
            {(currentUser) => (<Component {...props} currentUser={currentUser} />)}
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
  currentUser: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
  isAuthed: PropTypes.bool.isRequired,
};

export default PrivateRoute;
