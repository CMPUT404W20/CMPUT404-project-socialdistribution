import React from "react";
import PropTypes from "prop-types";
import "../../styles/post/PostPreviewModal.scss";
import Modal from "react-bootstrap/Modal";
import Post from "./Post";
import demoImage from "../../images/demo-img.png";

function PostPreviewModal(props) {
  const { onHide, show } = props;

  return (
    <Modal size="lg" onHide={onHide} show={show} className="post-preview-modal">
      <Modal.Header closeButton>
        <Modal.Title>Post Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Post
          username="username"
          postTime={new Date()}
          imageSrc={demoImage}
          content="Some content"
          previewMode
        />
      </Modal.Body>
    </Modal>
  );
}

PostPreviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default PostPreviewModal;
