import React, { Component } from "react";
import "../../styles/friends-notices/NoticeItem.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";

class NoticeItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  render() {
    const {
      username, userID, type, handleAccept, handleDecline,
    } = this.props;
    return (
      <Col>
        <div className="notice-item-wrapper">
          <Col sm={3} md={4}>
            <Link
              to={{
                pathname: `/profile/${username}`,
                state: { username, userID },
              }}
              className="username-link"
            >
              {username}
            </Link>
          </Col>
          <Col sm={3} md={4}>
            <div className="type-wrapper">
              <p>{type}</p>
            </div>
          </Col>
          <Col>
            <div className="button-wrapper">
              <button type="button" className="accept-button" onClick={() => handleAccept(userID)}>ACCEPT</button>
              <button type="button" className="decline-button" onClick={() => handleDecline(userID)}>DECLINE</button>
            </div>
          </Col>
        </div>
      </Col>

    );
  }
}

NoticeItem.propTypes = {
  username: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
};

export default NoticeItem;
