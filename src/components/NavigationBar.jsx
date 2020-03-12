import React, { Component } from "react";
import "../styles/NavigationBar.scss";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import logo from "../images/logo.svg";

// Example usage: <NavigationBar selected="Friends" />
class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem("username") || "User",
      userID: localStorage.getItem("userID"),
      numNotifications: 2,
    };
  }

  handleLogOut = () => {
    localStorage.clear();
  }

  render() {
    const { username, userID, numNotifications } = this.state;
    return (
      <Navbar collapseOnSelect expand="sm" fixed="top" className="navigationBar">
        <Navbar.Brand className="logo">
          <img src={logo} width="85%" alt="app logo" />
        </Navbar.Brand>
        <div className="search-input-container">
          <InputGroup size="sm" className="searchBar">
            <FormControl
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" />
          <Nav>
            <Nav.Link exact as={NavLink} to="/home">
              <HomeOutlinedIcon />
            </Nav.Link>
            <Nav.Link exact as={NavLink} to="/friends">
              <PeopleAltOutlinedIcon />
            </Nav.Link>
            <Nav.Link exact as={NavLink} to="/notifications">
              <div className="notification-icon-wrapper">
                <NotificationsNoneOutlinedIcon />
                <div className="notification-badge-wrapper">
                  <span className="notification-badge">{numNotifications}</span>
                </div>
              </div>
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={username} id="username-dropdown" alignRight>
              <NavDropdown.Item
                as={NavLink}
                exact
                to={{
                  pathname: `/profile/${username}`,
                  state: { isSelf: true },
                }}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} exact to="/" onSelect={this.handleLogOut}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
