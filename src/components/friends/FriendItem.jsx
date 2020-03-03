import React, { Component } from "react";
import "../../styles/friends/FriendItem.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
class FriendItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  render() {
    const { username, id, handleUnfollow } = this.props;
    return (
      <Col md={6}>
        <div className="friend-item-wrapper">
          {/* need to redirect to the user's profile page */}
          <a href=" " className="username-link">{username}</a>
          <DropdownButton
            id="friend-status"
            title="FRIENDS"
            drop="down"
            alignRight
          >
            <Dropdown.Item onClick={() => handleUnfollow(id)}>Unfriend</Dropdown.Item>
          </DropdownButton>
        </div>
      </Col>
    );
  }
}

FriendItem.propTypes = {
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUnfollow: PropTypes.func.isRequired,
};

export default FriendItem;
