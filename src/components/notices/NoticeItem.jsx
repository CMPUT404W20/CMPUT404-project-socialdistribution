import React, { Component } from "react";
import "../../styles/notices/NoticeItem.scss";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

class NoticeItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  render() {
    const {
      username, id, type, handleAccept, handleDecline,
    } = this.props;
    return (
      <Col>
        <div className="notice-item-wrapper">
          {/* need to redirect to the user's profile page */}
          <Col sm={3} md={4}>
            <a href=" " className="username-link">{username}</a>
          </Col>
          <Col sm={3} md={4}>
            <div className="type-wrapper">
              <p>{type}</p>
            </div>
          </Col>
          <Col>
            <div className="button-wrapper">
              <button type="button" className="accept-button" onClick={() => handleAccept(id)}>ACCEPT</button>
              <button type="button" className="decline-button" onClick={() => handleDecline(id)}>DECLINE</button>
            </div>
          </Col>
        </div>

      </Col>

    );
  }
}

NoticeItem.propTypes = {
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
};

export default NoticeItem;
