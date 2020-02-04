import React, { Component } from "react";
import "../styles/homepage.scss";
import NavBar from "./Navbar";
import MakePost from "./MakePost";

class Homepage extends Component {
  render() {
    return (
      <div className="Homepage">
        <NavBar selected="Home" />
        <MakePost />
      </div>
    );
  }
}
export default Homepage;
