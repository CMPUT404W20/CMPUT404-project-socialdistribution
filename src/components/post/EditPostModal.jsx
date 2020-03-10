import React from "react";
import PropTypes from "prop-types";
import "../../styles/post/EditPostModal.scss";
import Modal from "react-bootstrap/Modal";

function EditPostModal(props) {
  const {
    onHide,
    show,
  } = props;

  return (
    <Modal size="lg" onHide={onHide} show={show} className="edit-post-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Body
      </Modal.Body>
    </Modal>
  );
}

EditPostModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default EditPostModal;
