/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import PropTypes from "prop-types";
import "../../styles/post/PrivacySelectorModal.scss";
import Modal from "react-bootstrap/Modal";
import PublicIcon from "@material-ui/icons/Public";
import VpnLockIcon from "@material-ui/icons/VpnLock";
import LockIcon from "@material-ui/icons/Lock";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import githubIcon from "../../images/github.svg";
import PRIVACY from "../../constants";


function PrivacySelectorModal(props) {
  const {
    onHide,
    show,
    selectedPrivacy,
    onVisibilityChange,
  } = props;

  return (
    <Modal size="lg" onHide={onHide} show={true} className="privacy-selector-modal">
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
        {selectedPrivacy}
      </Modal.Body>
    </Modal>
  );
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
