import React from "react";
import {
  BrowserRouter, Route,
} from "react-router-dom";
import Homepage from "./Homepage";
import PrivateRoute from "./PrivateRoute";
import FriendsPage from "./friends/FriendsPage";
import NoticesPage from "./notices/NoticesPage";
import ProfilePage from "./profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <PrivateRoute />
      <Route exact path="/home" component={Homepage} />
      <Route exact path="/friends" component={FriendsPage} />
      <Route exact path="/notifications" component={NoticesPage} />
      <Route exact path="/profile/:username" component={ProfilePage} />
    </BrowserRouter>
  );
}

export default App;
