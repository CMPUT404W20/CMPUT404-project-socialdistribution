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

  renderDropDown = (isFriends) => {
    const { handleUnFriend, handleUnFollow } = this.props;
    return (
      <DropdownButton
        id="friend-status"
        title={isFriends ? "FRIENDS" : "FOLLOWING"}
        drop="down"
        alignRight
      >
        {isFriends
          ? (<Dropdown.Item onClick={() => handleUnFriend()}>Unfriend</Dropdown.Item>)
          : (<Dropdown.Item onClick={() => handleUnFollow()}>Unfollow</Dropdown.Item>)}
      </DropdownButton>
    );
  }

  renderFollowButton = () => {
    const { handleFollow } = this.props;
    return (
      <button
        type="button"
        className="follow-button"
        onClick={handleFollow}
      >
        Follow
      </button>
    );
  };

  render() {
    const {
      modalShow,
    } = this.state;
    const {
      username, currentUser, isSelf, host,
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
            <EditProfileModal
              show={modalShow}
              onHide={this.renderModal}
              currentUser={currentUser}
            />
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
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
  handleFollow: PropTypes.func.isRequired,
  handleUnFriend: PropTypes.func.isRequired,
  handleUnFollow: PropTypes.func.isRequired,
};

export default ProfileHeader;
