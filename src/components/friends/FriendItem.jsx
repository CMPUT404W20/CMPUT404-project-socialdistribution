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
      user, handleUnFriend,
    } = this.props;
    return (
      <Col md={6}>
        <div className="friend-item-wrapper">
          <Link
            to={{
              pathname: `/profile/${user.displayName}`,
              state: { user },
            }}
            className="username-link"
          >
            {user.displayName}
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
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
  handleUnFriend: PropTypes.func.isRequired,
};

export default FriendItem;
