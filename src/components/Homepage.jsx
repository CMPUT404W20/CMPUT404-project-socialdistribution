import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/homepage.scss";
import NavBar from "./Navbar";
import MakePost from "./MakePost";


class Homepage extends Component {
  render() {
	return (
    <div className="Homepage">
      <NavBar/>
      <MakePost/>
    </div>
  );
  }
}
export default Homepage;

