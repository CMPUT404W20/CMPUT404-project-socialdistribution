import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import "../styles/NavigationBar.scss";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import PropTypes from "prop-types";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, withRouter } from "react-router-dom";
import logo from "../images/logo.svg";
import * as auth from "../services/AuthenticationService";
import * as friendsService from "../services/FriendService";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numNotifications: 0,
      keyword: "",
      loading: true,
    };
  }

  componentDidMount() {
    friendsService.getAuthorFriendRequests().then((response) => {
      this.setState({
        numNotifications: response.length,
        loading: false,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleLogOut = () => {
    const { history } = this.props;
    auth.logoutUser().then((response) => {
      if (response.status === 200) {
        history.push("/login");
      }
    });
  }

  handleSearchTextChange = (event) => {
    this.setState({ keyword: event.target.value });
  }

  handleSearchKeyPress = (event) => {
    const { keyword } = this.state;
    const { history } = this.props;
    if (event.key === "Enter") {
      event.preventDefault();
      if (keyword !== "") {
        history.push(`/search?username=${keyword}`);
      }
    }
  }

  render() {
    const {
      numNotifications, keyword, loading,
    } = this.state;
    const { currentUser } = this.props;
    return (
      !loading && (
      <Navbar collapseOnSelect expand="sm" fixed="top" className="navigationBar">
        <Navbar.Brand className="logo">
          <img src={logo} width="85%" alt="app logo" />
        </Navbar.Brand>
        <div className="search-input-container">
          <InputGroup size="sm" className="searchBar" onSubmit={this.handleRedirect}>
            <FormControl
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon1"
              value={keyword}
              onChange={this.handleSearchTextChange}
              onKeyPress={this.handleSearchKeyPress}
            />
          </InputGroup>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" />
          <Nav>
            <Nav.Link exact as={NavLink} to="/">
              <HomeOutlinedIcon />
            </Nav.Link>
            <Nav.Link exact as={NavLink} to="/friends">
              <PeopleAltOutlinedIcon />
            </Nav.Link>
            <Nav.Link exact as={NavLink} to="/notifications">
              <div className="notification-icon-wrapper">
                <NotificationsNoneOutlinedIcon />
                {numNotifications === 0 ? null : (
                  <div className="notification-badge-wrapper">
                    <span className="notification-badge">{numNotifications}</span>
                  </div>
                )}

              </div>
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={currentUser.displayName} id="username-dropdown" alignRight>
              <Fade left duration={500} distance="5px">
                <NavDropdown.Item
                  as={NavLink}
                  exact
                  to={{
                    pathname: `/profile/${currentUser.displayName}`,
                    state: { user: currentUser },
                  }}
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="https://youtu.be/Gb9WBos6LyQ" target="_blank">Help</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onSelect={this.handleLogOut}>Logout</NavDropdown.Item>
              </Fade>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      )
    );
  }
}

NavigationBar.propTypes = {
  history: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
};

export default withRouter(NavigationBar);
