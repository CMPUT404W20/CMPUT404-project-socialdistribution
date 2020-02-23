import React, { Component } from "react";
import "../styles/ProfileHeader.scss";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Username",
      remote: false,
      friend: true,
      following: true,
      self: false,
    };
  }

  handleEditButtonClick = () => {
    // eslint-disable-next-line no-alert
    alert("todo");
  };

  renderStatus = () => {
    const { self, following, friend } = this.state;
    if (!self) {
      if (!friend && !following) {
        return (this.renderFollowButton());
      }
      if (!friend && following) {
        return (this.renderDropDown(false));
      }
      return (this.renderDropDown(true));
    }
    return (this.renderEditProfileButton());
  };

  renderEditProfileButton = () => (
    <button
      type="button"
      className="edit-profile-button"
      onClick={this.handleEditButtonClick}
    >
      <EditOutlinedIcon className="edit-icon" />
      <span>EDIT PROFILE</span>
    </button>
  );

  handleFollow = () => {
    this.setState({ following: true });
  };

  renderDropDown = (isFriend) => (
    <DropdownButton
      id="friend-status"
      title={isFriend === true ? "FRIENDS" : "FOLLOWING"}
      drop="down"
      alignRight
    >
      <Dropdown.Item onClick={this.handleUnStatus}>{isFriend === true ? "Unfriend" : "Unfollow"}</Dropdown.Item>
    </DropdownButton>
  );

  handleUnStatus = () => {
    const { friend } = this.state;
    if (friend) {
      this.setState({ friend: false });
    }
    this.setState({ following: false });
  };

  renderFollowButton = () => (
    <button
      type="button"
      className="follow-button"
      onClick={this.handleFollow}
    >
      Follow
    </button>
  );

  render() {
    const { username, remote } = this.state;
    return (
      <div className="profileHeader">
        <div className="image-section" />
        <div className="user-section">
          <div className="row1">
            <p>{username}</p>
            <p>{remote === true ? "Remote" : "Local"}</p>
          </div>
          <div className="row2">
            {this.renderStatus()}
          </div>
        </div>
      </div>
    );
  }
}
export default ProfileHeader;
