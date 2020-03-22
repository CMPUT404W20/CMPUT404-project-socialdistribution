import React, { Component } from "react";
import "../../styles/friends-notices-search/NoticeItem.scss";
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
      username, userID, type,
    } = this.props;
    return (
      <Row className="wrapper">
        <Col md={12} lg={4} className="leftColumn">
          <p className="username-link">
            {username}
          </p>
        </Col>
        <Col md={12} lg={3} className="middleColumn">
          <div className="type-wrapper">{type}</div>
        </Col>
        <Col md={12} lg={5} className="rightColumn">
          <div className="button-wrapper">
            <Link
              to={{
                pathname: `/profile/${username}`,
                state: { username, userID },
              }}
            >
              <button type="button" className="view-profile-button">View Profile</button>
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
  type: PropTypes.string.isRequired,
};

export default SearchItem;
