import React, { Component } from "react";
import "../styles/ProfileHeader.scss";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";


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

  handleEditButtonClick() {
    alert("todo");
  }

  renderStatus() {
    const { self, following, friend } = this.state;
    if (friend) {
      this.renderFriendOptions(true);
    }
  }

  render() {
    return (
      <div className="profileHeader">
        <div className="image-section">
          <button
            type="button"
            className="edit-profile-button"
            onClick={() => this.handleEditButtonClick()}
          >
            <EditOutlinedIcon className="edit-icon" />
            <span>EDIT PROFILE</span>
          </button>
        </div>
        <div className="user-section">
          <div className="row1">
            <p>{this.state.username}</p>
            <p>{this.state.remote === true ? "Remote" : "Local"}</p>
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
