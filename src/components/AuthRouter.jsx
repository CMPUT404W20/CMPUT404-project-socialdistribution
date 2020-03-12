import React from "react";
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
import Homepage from "./Homepage";
import NavigationBar from "./NavigationBar";
import FriendsPage from "./friends/FriendsPage";
import NoticesPage from "./notices/NoticesPage";
import ProfilePage from "./profile/ProfilePage";

export default function AuthRouter() {
  return (
    <BrowserRouter>
      <div>
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/friends" component={FriendsPage} />
          <Route path="/notifications" component={NoticesPage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
