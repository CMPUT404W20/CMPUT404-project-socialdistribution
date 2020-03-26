import React from "react";
import PropTypes from "prop-types";
import "../../styles/profile/EditProfileModal.scss";
import Modal from "react-bootstrap/Modal";

function EditProfileModal(props) {
  const { onHide, show, github } = props;
  const username = localStorage.getItem("username");
  return (
    <Modal onHide={onHide} show={show} className="edit-profile-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          name="username"
          value={username}
          placeholder="Display Name"
        />

        <input
          type="text"
          name="github"
          value={github}
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
  github: PropTypes.string.isRequired,
};

export default EditProfileModal;
