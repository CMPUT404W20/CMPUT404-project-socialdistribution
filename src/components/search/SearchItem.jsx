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
      user, currentHost,
    } = this.props;
    return (
      <Row className="wrapper">
        <Col md={12} lg={4} className="leftColumn">
          <p className="username-link">
            {user.displayName}
          </p>
        </Col>
        <Col md={12} lg={3} className="middleColumn">
          <div className="type-wrapper">{ user.host === currentHost ? "Local" : "Remote"}</div>
        </Col>
        <Col md={12} lg={5} className="rightColumn">
          <div className="button-wrapper">
            <Link
              className="view-profile-button"
              to={{
                pathname: `/profile/${user.displayName}`,
                state: { user },
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
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
  currentHost: PropTypes.string.isRequired,
};

export default SearchItem;
