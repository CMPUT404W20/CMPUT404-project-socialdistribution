import React, { Component } from "react";
import { Navbar, NavItem, Nav, Form, FormControl} from "react-bootstrap";
import "../styles/Nav.scss";
import logo from "../images/logo.svg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";



class NavBar extends Component {
  render() {
    return (
        <Container className="nav">
          <Row className="navRow">
            <div className="logo-container">
              <img src={logo} width="80%" />
            </div>
            <div class="search-input-container">
              {/* color can be changed!!! */}
              <SearchRoundedIcon color="primary" />
              <input class="search-input" placeholder="Search" />
            </div>
            <div className="right-side-menu">
              <div className="icons">
                <a className="Home" href="">
                  <HomeOutlinedIcon />
                  <p>HOME</p>
                </a>
                <a className="Friends" href="">
                  <PeopleAltOutlinedIcon />
                  <p>FRIENDS</p>
                </a>
                <a className="Notice" href="">
                  <NotificationsNoneOutlinedIcon />
                  <p>NOTICES</p>
                </a>
              </div>
              <div className="user">
                {/* need to change this later */}
                <a href="">
                  <p>USERNAME</p>
                </a>
              </div>
              <div className="log-out">
                <a className="logout-div" href="">
                  <ExitToAppOutlinedIcon />
                  <p>LOG OUT</p>
                </a>
              </div>
            </div>
          </Row>
        </Container>
    );
  }
}

export default NavBar;
