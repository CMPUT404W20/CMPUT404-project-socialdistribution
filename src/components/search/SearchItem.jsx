import React, { Component } from "react";
import "../../styles/friends-notices-search/SearchItem.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      username, userID, host,
    } = this.props;
    const currentHost = localStorage.getItem("host");
    return (
      <Row className="wrapper">
        <Col md={12} lg={4} className="leftColumn">
          <p className="username-link">
            {username}
          </p>
        </Col>
        <Col md={12} lg={3} className="middleColumn">
          <div className="type-wrapper">{ host === currentHost ? "Local" : "Remote"}</div>
        </Col>
        <Col md={12} lg={5} className="rightColumn">
          <div className="button-wrapper">
            <Link
              className="view-profile-button"
              to={{
                pathname: `/profile/${username}`,
                state: { user: { displayName: username, id: userID, host } },
              }}
            >
              View Profile
            </Link>
          </div>
        </Col>
      </Row>
    );
  }
}

SearchItem.propTypes = {
  username: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
};

export default SearchItem;
