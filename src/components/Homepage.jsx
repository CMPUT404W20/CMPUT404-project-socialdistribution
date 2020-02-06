import React, { Component } from "react";
import "../styles/homepage.scss";
import NavBar from "./NavBar";
import MakePost from "./MakePost";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

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
