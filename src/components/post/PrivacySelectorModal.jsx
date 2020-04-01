/* eslint-disable jsx-a11y/control-has-associated-label */
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
import PRIVACY from "../../constants";

const PRIVACY_MESSAGES = {
  PUBLIC: "This post will be visible to everyone",
  PRIVATE: "This post will only be visible to selected users",
  FRIENDS: "This post will be visible to your friends",
  FOAF: "This post will be visible to your friends, and their friends",
  SERVERONLY: "This post will be visible to users on this server",
  UNLISTED: "This post will only be available to users with the link",
};

class PrivacySelectorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleTo: [],
    };
  }

  handleSubmit = () => {
    const { onHide } = this.props;

    onHide();
  }

  // eslint-disable-next-line arrow-body-style
  renderPeopleSelector = () => {
    return (
      <div className="privacy-people-selector">
        Select People
      </div>
    );
  }

  render() {
    const {
      onHide,
      show,
      selectedPrivacy,
      onVisibilityChange,
    } = this.props;

    return (
      <Modal onHide={onHide} show={show} className="privacy-selector-modal">
        <Modal.Body>
          <div className="privacy-button-wrapper">
            <button
              type="button"
              className={`privacy-button ${selectedPrivacy === PRIVACY.public ? "selected" : ""}`}
              onClick={() => onVisibilityChange(PRIVACY.public)}
            >
              <PublicIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${selectedPrivacy === PRIVACY.server ? "selected" : ""}`}
              onClick={() => onVisibilityChange(PRIVACY.server)}
            >
              <VpnLockIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${selectedPrivacy === PRIVACY.friends ? "selected" : ""}`}
              onClick={() => onVisibilityChange(PRIVACY.friends)}
            >
              <PeopleAltIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${selectedPrivacy === PRIVACY.mutualFriends ? "selected" : ""}`}
              onClick={() => onVisibilityChange(PRIVACY.mutualFriends)}
            >
              <GroupAddIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${selectedPrivacy === PRIVACY.private ? "selected" : ""}`}
              onClick={() => onVisibilityChange(PRIVACY.private)}
            >
              <LockIcon />
            </button>
            <button
              type="button"
              className={`privacy-button ${selectedPrivacy === PRIVACY.unlisted ? "selected" : ""}`}
              onClick={() => onVisibilityChange(PRIVACY.unlisted)}
            >
              <VisibilityOffIcon />
            </button>
          </div>

          <div className="privacy-message">
            { PRIVACY_MESSAGES[selectedPrivacy] }
          </div>

          {
            selectedPrivacy === PRIVACY.private
              ? this.renderPeopleSelector()
              : null
          }

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
  selectedPrivacy: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
};

PrivacySelectorModal.defaultProps = {
};

export default PrivacySelectorModal;
