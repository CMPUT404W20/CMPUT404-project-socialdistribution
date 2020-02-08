import React, { Component } from "react";
import "../styles/NavBar.scss";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import PropTypes from "prop-types";
import logo from "../images/logo.svg";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

// Example usage: <Navbar selected="Friends" />
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Username",
      notification: 1,
    };
  }
  // will implement search later. Disabled eslint for this method for now

  // eslint-disable-next-line class-methods-use-this
  handleSubmit(event) {
    if (event.key === "Enter") {
      // eslint-disable-next-line no-alert
      alert(event.target.value);
    }
  }

  render() {
    const { username, notification } = this.state;
    const { selected } = this.props;
    return (
      <Container className="header" fluid>
        <Navbar collapseOnSelect expand="sm">
          <Navbar.Brand className="logo">
            <img src={logo} width="85%" alt="app logo" />
          </Navbar.Brand>
          <div className="search-input-container">
            {/* <input
              className="search-input"
              placeholder="Search"
              onKeyDown={this.handleSubmit}
            /> */}
            <InputGroup size="sm" className="searchBar">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                className="formform"
              />
            </InputGroup>
          </div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" />
            <Nav>
              <Nav.Link target="_blank" href="#">
                <HomeOutlinedIcon />
                {/* <br />
                Home */}
              </Nav.Link>
              <Nav.Link target="_blank" href="#">
                <PeopleAltOutlinedIcon />
                {/* <br />
                Friends */}
              </Nav.Link>
              <Nav.Link target="_blank" href="#">
                <div className="icon-wrapper">
                  <NotificationsNoneOutlinedIcon />
                  <div className="badge-wrapper">
                    <span className="badge">{2}</span>
                  </div>
                </div>
                {/* <NotificationsNoneOutlinedIcon /> */}
                {/* <br />
                Notices */}
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link target="_blank" href="#">
                {/* <NotificationsNoneOutlinedIcon /> */}
                username
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      // <div className="nav">
      //   <div className="navRow">
      //     <div className="left-menu">
      //       <div className="logo-container">
      //         <img src={logo} width="85%" alt="app logo" />
      //       </div>
      //       <div className="search-input-container">
      //         <SearchRoundedIcon className="searchButton" />
      //         <input
      //           className="search-input"
      //           placeholder="Search"
      //           onKeyDown={this.handleSubmit}
      //         />
      //       </div>
      //     </div>
      //     <div className="right-side-menu">
      //       <div className="icons">
      //         <a
      //           className={selected === "Home" ? "Home selected" : "Home"}
      //           href=" "
      //         >
      //           <HomeOutlinedIcon />
      //           <p>HOME</p>
      //         </a>
      //         <a
      //           className={
      //             selected === "Friends" ? "Friends selected" : "Friends"
      //           }
      //           href=" "
      //         >
      //           <PeopleAltOutlinedIcon />
      //           <p>FRIENDS</p>
      //         </a>
      //         <a
      //           className={
      //             selected === "Notices" ? "Notices selected" : "Notices"
      //           }
      //           href=" "
      //         >
      //           <div className="icon-wrapper">
      //             <NotificationsNoneOutlinedIcon />
      //             <div className="badge-wrapper">
      //               <span className="badge">{notification}</span>
      //             </div>
      //           </div>
      //           <p>NOTICES</p>
      //         </a>
      //       </div>
      //       <div className="user">
      //         <a href=" " className={selected === "Username" ? "selected" : ""}>
      //           <p>{username}</p>
      //         </a>
      //       </div>
      //       <div className="log-out">
      //         <a className="logout-div" href=" ">
      //           <ExitToAppOutlinedIcon className="post-icon" />
      //           <p>LOG OUT</p>
      //         </a>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}
NavBar.propTypes = {
  selected: PropTypes.string,
};

NavBar.defaultProps = {
  selected: "",
};

export default NavBar;
