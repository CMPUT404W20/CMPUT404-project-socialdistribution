/* eslint-disable react/jsx-props-no-spreading */
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
import PostView from "./post/PostView";
import Login from "./Login";
import * as auth from "../services/AuthenticationService";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      isLoading: true,
      isAuthed: false,
    };
  }

  componentDidMount() {
    auth.getCurrentUser().then((response) => {
      if (response.status === 200) {
        this.setState({ currentUser: response.data, isAuthed: true, isLoading: false });
      } else {
        this.setState({ isLoading: false });
      }
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isLoading, isAuthed, currentUser } = this.state;
    return (
      (!isLoading) && (
      <BrowserRouter forceRefresh>
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={Homepage} isAuthed={isAuthed} currentUser={currentUser} />
        <PrivateRoute exact path="/friends" component={FriendsPage} isAuthed={isAuthed} currentUser={currentUser} />
        <PrivateRoute exact path="/notifications" component={NoticesPage} isAuthed={isAuthed} currentUser={currentUser} />
        <Route
          path="/search"
          render={(props) => (
            <SearchPage key={props.location.search} currentUser={currentUser} {...props} />
          )}
        />
        <Route
          path="/profile/:username"
          render={(props) => (
            <ProfilePage key={props.match.params.username} currentUser={currentUser} {...props} />
          )}
        />
        <Route
          path="/share/posts/:postId"
          render={(props) => {
            const { postId } = props.match.params;
            // Urls that has a parameter inside must have a key otherwise viewing a shared post
            // from other shared post will not work. With the key the router will refresh itself.
            return (<PostView key={postId} postId={postId} currentUser={currentUser} {...props} />);
          }}
        />
      </BrowserRouter>
      )
    );
  }
}


App.propTypes = {
  match: PropTypes.objectOf(PropTypes.checkPropTypes()),
  location: PropTypes.objectOf(PropTypes.checkPropTypes()),
};
App.defaultProps = {
  match: null,
  location: null,
};
export default App;
