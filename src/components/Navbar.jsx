import React, { Component } from "react";
import Col from "react-bootstrap/Col";
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
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      notification: 1,
    };
    var element = document.getElementsByClassName(this.props.selected);
    element.className += "selected";
  }
  handleSubmit(event) {
    if (event.key === 'Enter') {
      alert('you entered: ' + event.target.value);
    }
    
  }
  render() {
    
    return (
      <Container className="nav">
        <Row className="navRow">
          <div className="left-menu">
            <div className="logo-container">
              <img src={logo} width="70%" />
            </div>
            <div class="search-input-container">
              {/* color can be changed!!! */}
              <SearchRoundedIcon style={{ color:"#0275B1"}} />
              <input class="search-input" placeholder="Search" onKeyDown={this.handleSubmit}/>
            </div>
          </div>
          <div className="right-side-menu">
              <div className="icons">
              <a className={this.props.selected==="Home" ? "Home selected" : "Home"} href="">
                {/* <a className="Home" href="#"> */}
                  <HomeOutlinedIcon />
                  <p>HOME</p>
                </a>
              <a className={this.props.selected === "Friends" ? "Friends selected" : "Friends"}  href="">
                  <PeopleAltOutlinedIcon />
                  <p>FRIENDS</p>
                </a>
              <a className={this.props.selected === "Notices" ? "Notices selected" : "Notices"} href="">
                  <div className="icon-wrapper">
                    <NotificationsNoneOutlinedIcon />
                    <div className="badge-wrapper">
                    <span className="badge">{this.state.notification}</span>
                  </div>
                </div>
                  <p>NOTICES</p>
                </a>
              </div>
              <div className="user">
              <a href="#" className={this.props.selected === "Username" ? "selected" : ""}>
                  <p>{this.state.username}</p>
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
