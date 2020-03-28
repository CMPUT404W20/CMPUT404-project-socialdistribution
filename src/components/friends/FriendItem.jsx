import React, { Component } from "react";
import "../../styles/friends-notices-search/FriendItem.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

class FriendItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  render() {
    const {
      username, userID, host, handleUnFriend,
    } = this.props;
    return (
      <Col md={6}>
        <div className="friend-item-wrapper">
          <Link
            to={{
              pathname: `/profile/${username}`,
              state: { user: { displayName: username, id: userID, host } },
            }}
            className="username-link"
          >
            {username}
          </Link>
          <DropdownButton
            id="friend-status"
            title="FRIENDS"
            drop="down"
            alignRight
          >
            <Dropdown.Item onClick={() => handleUnFriend()}>Unfriend</Dropdown.Item>
          </DropdownButton>
        </div>
      </Col>
    );
  }
}

FriendItem.propTypes = {
  username: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  handleUnFriend: PropTypes.func.isRequired,
};

export default FriendItem;
