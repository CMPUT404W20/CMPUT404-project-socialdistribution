import React, { Component } from "react";
import "../../styles/friends-notices-search/NoticeItem.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { userContext } from "../../contexts/UserContext";

class NoticeItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      user, handleAccept, handleDecline,
    } = this.props;
    return (
      <Row className="wrapper">
        <Col md={12} lg={4} className="leftColumn">
          <Link
            to={{
              pathname: `/profile/${user.displayName}`,
              state: { user },
            }}
            className="username-link"
          >
            {user.displayName}
          </Link>
        </Col>
        <Col md={12} lg={3} className="middleColumn">
          <userContext.Consumer>
            {(currentUser) => (<div className="type-wrapper">{ user.host === currentUser.host ? "Local" : "Remote"}</div>)}
          </userContext.Consumer>
        </Col>
        <Col md={12} lg={5} className="rightColumn">
          <div className="button-wrapper">
            <button type="button" className="accept-button" onClick={() => handleAccept()}>Accept</button>
            <button type="button" className="decline-button" onClick={() => handleDecline()}>Decline</button>
          </div>
        </Col>
      </Row>
    );
  }
}

NoticeItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
};

export default NoticeItem;
