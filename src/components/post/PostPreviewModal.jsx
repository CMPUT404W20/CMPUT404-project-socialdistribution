import React from "react";
import PropTypes from "prop-types";
import "../../styles/post/PostPreviewModal.scss";
import Modal from "react-bootstrap/Modal";

function PostPreviewModal(props) {
  const { onHide, show } = props;

  return (
    <Modal onHide={onHide} show={show} className="upload-image-modal">
      <Modal.Header closeButton>
        <Modal.Title>Post Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Testing
      </Modal.Body>
      {/* <Modal.Footer className="upload-button-wrapper">
        <button
          type="button"
          className="upload-button"
          onClick={onHide}
        >
          Upload
        </button>
      </Modal.Footer> */}
    </Modal>
  );
}

PostPreviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default PostPreviewModal;
