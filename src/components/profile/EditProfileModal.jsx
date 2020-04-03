import React from "react";
import PropTypes from "prop-types";
import "../../styles/profile/EditProfileModal.scss";
import Modal from "react-bootstrap/Modal";

function EditProfileModal(props) {
  const { onHide, show, currentUser } = props;
  return (
    <Modal onHide={onHide} show={show} className="edit-profile-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          disabled
          type="text"
          name="username"
          value={currentUser.displayName}
          placeholder="Display Name"
        />

        <input
          type="text"
          name="github"
          value={currentUser.github}
          placeholder="Github URL"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
        />

      </Modal.Body>
      <Modal.Footer className="save-button-wrapper">
        <button
          type="button"
          className="save-button"
          onClick={onHide}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

EditProfileModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
};

export default EditProfileModal;
