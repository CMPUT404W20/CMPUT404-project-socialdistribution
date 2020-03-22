import React from "react";
import {
  BrowserRouter, Route,
} from "react-router-dom";
import PropTypes from "prop-types";
import Homepage from "./Homepage";
import PrivateRoute from "./PrivateRoute";
import FriendsPage from "./friends/FriendsPage";
import NoticesPage from "./notices/NoticesPage";
import ProfilePage from "./profile/ProfilePage";
import SearchPage from "./search/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <PrivateRoute />
      <Route exact path="/home" component={Homepage} />
      <Route exact path="/friends" component={FriendsPage} />
      <Route exact path="/notifications" component={NoticesPage} />
      <Route
        path="/search?username=:query"
        render={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <SearchPage key={props.match.params.query} {...props} />)}
      />
      <Route
        path="/profile/:username"
        render={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <ProfilePage key={props.match.params.username} {...props} />)}
      />
    </BrowserRouter>
  );
}

App.propTypes = {
  match: PropTypes.objectOf(PropTypes.checkPropTypes()),
};
App.defaultProps = {
  match: null,
};
export default App;
