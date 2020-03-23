import React from "react";
import PropTypes from "prop-types";
import "../../styles/post/PostPreviewModal.scss";
import Modal from "react-bootstrap/Modal";
import Post from "./Post";

function PostPreviewModal(props) {
  const {
    onHide,
    show,
    postTitle,
    postContent,
    imageObjectUrl,
  } = props;

  // Post requires a Post object for rendering
  const postObj = {
    id: "-1", // arbitrary ID for the Post object
    title: postTitle,
    imageSrc: imageObjectUrl,
    content: postContent,
    published: (new Date()).toISOString(),
    username: "username",
  };

  return (
    <Modal size="lg" onHide={onHide} show={show} className="post-preview-modal">
      <Modal.Header closeButton>
        <Modal.Title>Post Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Post
          post={postObj}
          previewMode // to prevent it from rendering the menu bar with dropdown and time
        />
      </Modal.Body>
    </Modal>
  );
}

PostPreviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  postTitle: PropTypes.string.isRequired,
  postContent: PropTypes.string.isRequired,
  imageObjectUrl: PropTypes.string,
};

PostPreviewModal.defaultProps = {
  imageObjectUrl: "",
};

export default PostPreviewModal;
