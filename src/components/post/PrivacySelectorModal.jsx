import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/post/PrivacySelectorModal.scss";
import Modal from "react-bootstrap/Modal";
import PublicIcon from "@material-ui/icons/Public";
import VpnLockIcon from "@material-ui/icons/VpnLock";
import LockIcon from "@material-ui/icons/Lock";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import UserSelector from "./UserSelector";

const PRIVACY_MESSAGES = {
  PUBLIC: "This post will be visible to everyone",
  PRIVATE: "This post will only be visible to the selected users",
  FRIENDS: "This post will be visible to your friends",
  FOAF: "This post will be visible to your friends, and their friends",
  SERVERONLY: "This post will be visible to users on this server",
  UNLISTED: "This post will only be available to users with the link",
};

const PRIVACY = Object.freeze({
  public: "PUBLIC",
  private: "PRIVATE",
  friends: "FRIENDS",
  mutualFriends: "FOAF",
  server: "SERVERONLY",
  unlisted: "UNLISTED",
});


class PrivacySelectorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: props.selectedVisibility,
      visibleTo: props.selectedVisibileTo,
    };
  }

  handleVisibleToAddition = (authorId) => {
    const { visibleTo } = this.state;

    if (visibleTo.indexOf(authorId) === -1) {
      this.setState((prevState) => ({
        visibleTo: [...prevState.visibleTo, authorId],
      }));
    }
  }

  handleVisibleToRemoval = (authorId) => {
    this.setState((prevState) => ({
      visibleTo: prevState.visibleTo.filter((id) => id !== authorId),
    }));
  }

  handleVisibilityChange = (visibility) => {
    if (visibility !== PRIVACY.private) {
      this.setState({
        visibility,
        visibleTo: [],
      });
    }

    this.setState({
      visibility,
    });
  }

  handleSubmit = () => {
    const { visibility, visibleTo } = this.state;
    const { onSubmit } = this.props;

    onSubmit(visibility, visibleTo);
  }

  handleHide = () => {
    const { selectedVisibility, selectedVisibileTo, onHide } = this.props;

    // reset the state back to the original
    // since this is a modal, we have to do this explicitly because
    // it will not unmount like a regular component - it will just hide
    // so without this step, the data will save in the component state
    // but not in the actual post data
    this.setState({
      visibility: selectedVisibility,
      visibleTo: selectedVisibileTo,
    });

    onHide();
  }

  render() {
    const { show } = this.props;
    const { visibility, visibleTo } = this.state;

    return (
      <Modal onHide={this.handleHide} show={show} className="privacy-selector-modal">
        <Modal.Body>
          <div className="privacy-button-wrapper">
            <button
              type="button"
              className={`privacy-button ${visibility === PRIVACY.public ? "selected" : ""}`}
              onClick={() => this.handleVisibilityChange(PRIVACY.public)}
            >
              <PublicIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${visibility === PRIVACY.server ? "selected" : ""}`}
              onClick={() => this.handleVisibilityChange(PRIVACY.server)}
            >
              <VpnLockIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${visibility === PRIVACY.friends ? "selected" : ""}`}
              onClick={() => this.handleVisibilityChange(PRIVACY.friends)}
            >
              <PeopleAltIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${visibility === PRIVACY.mutualFriends ? "selected" : ""}`}
              onClick={() => this.handleVisibilityChange(PRIVACY.mutualFriends)}
            >
              <GroupAddIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${visibility === PRIVACY.private ? "selected" : ""}`}
              onClick={() => this.handleVisibilityChange(PRIVACY.private)}
            >
              <LockIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${visibility === PRIVACY.unlisted ? "selected" : ""}`}
              onClick={() => this.handleVisibilityChange(PRIVACY.unlisted)}
            >
              <VisibilityOffIcon />
            </button>
          </div>

          <div className="privacy-message">
            { PRIVACY_MESSAGES[visibility] }
          </div>

          <UserSelector
            onUserRemoval={this.handleVisibleToRemoval}
            onUserAdd={this.handleVisibleToAddition}
            visibleTo={visibleTo}
            show={visibility === PRIVACY.private}
          />

        </Modal.Body>
        <Modal.Footer className="privacy-select-button-wrapper">
          <button
            type="button"
            className="privacy-select-button"
            onClick={this.handleSubmit}
          >
            Update Privacy
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PrivacySelectorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedVisibility: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedVisibileTo: PropTypes.array.isRequired,
};

PrivacySelectorModal.defaultProps = {
};

export default PrivacySelectorModal;
