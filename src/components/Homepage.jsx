import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "./Navbar";
import "../styles/homepage.scss";

class Homepage extends Component {
  render() {
	return (
    <div className="Homepage">
		  <NavBar/>

    </div>
  );
  }
}
export default Homepage;

