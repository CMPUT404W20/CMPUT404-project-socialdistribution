import React, { Component } from "react";
import "../../styles/profile/ProfileHeader.scss";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import PropTypes from "prop-types";
import EditProfileModal from "./EditProfileModal";

class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    const { isFriends, isFollowing } = this.props;
    this.state = {
      modalShow: false,
      isFriends,
      isFollowing,
    };
  }

  handleEditButtonClick = () => {
    // eslint-disable-next-line no-alert
    alert("todo");
  };

  renderModal = () => {
    const { modalShow } = this.state;
    if (modalShow) {
      this.setState({ modalShow: false });
    } else {
      this.setState({ modalShow: true });
    }
  };

  renderStatus = () => {
    const { isSelf } = this.props;
    const { isFollowing, isFriends } = this.state;
    if (!isSelf) {
      if (!isFriends && !isFollowing) {
        return (this.renderFollowButton());
      }
      if (isFriends) {
        return (this.renderDropDown(true));
      }
      return (this.renderDropDown(false));
    }
    return (this.renderEditProfileButton());
  };

  renderEditProfileButton = () => (
    <button
      type="button"
      className="edit-profile-button"
      onClick={this.renderModal}
    >
      <EditOutlinedIcon className="edit-icon" />
      <span>EDIT PROFILE</span>
    </button>
  );

  handleFollow = () => {
    this.setState({ isFollowing: true });
  };

  renderDropDown = (isFriends) => (
    <DropdownButton
      id="friend-status"
      title={isFriends === true ? "FRIENDS" : "FOLLOWING"}
      drop="down"
      alignRight
    >
      <Dropdown.Item onClick={this.handleUnFollow}>{isFriends === true ? "Unfriend" : "Unfollow"}</Dropdown.Item>
    </DropdownButton>
  );

  handleUnFollow = () => {
    this.setState({ isFriends: false, isFollowing: false });
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
    const {
      modalShow,
    } = this.state;
    const {
      username, github, isSelf, host,
    } = this.props;
    return (
      <div className="profileHeader">
        <div className="image-section" />
        <div className="user-section">
          <div className="row1">
            <p>{username}</p>
            {isSelf ? null : (<p>{host}</p>)}
          </div>
          <div className="row2">
            {this.renderStatus()}
            <EditProfileModal show={modalShow} onHide={this.renderModal} github={github} />
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  isFriends: PropTypes.bool.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  host: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
};

export default ProfileHeader;
