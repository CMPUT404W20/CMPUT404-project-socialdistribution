/* eslint-disable max-classes-per-file */
import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/post/MakePost.scss";
import SendIcon from "@material-ui/icons/Send";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import Modal from "react-bootstrap/Modal";

function UploadImageModal(props) {
  const { onHide, show } = props;

  return (
    <Modal onHide={onHide} show={show} className="upload-image-modal">
      <Modal.Header closeButton>
        <Modal.Title>Upload images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          accept="image/*"
          className="upload-image"
          id="contained-button-file"
          multiple
          type="file"
        />
      </Modal.Body>
      <Modal.Footer className="upload-button-wrapper">
        <button
          type="button"
          className="upload-button"
          onClick={onHide}
        >
          Upload
        </button>
      </Modal.Footer>
    </Modal>
  );
}

UploadImageModal.propTypes = {
  show: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};


class MakePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      post: "",
    };
  }

  handleTextChange = (event) => {
    this.setState({ post: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { post } = this.state;
    // eslint-disable-next-line no-alert
    alert(post);
  };

  renderModal = () => {
    this.setState({ modalShow: true });
  };

  render() {
    const { modalShow } = this.state;
    const handleClose = () => this.setState({ modalShow: false });
    return (
      <div className="make-post-wrapper">
        <div className="make-post-content">
          <div className="make-post-header">
            <b>NEW POST</b>
            <select className="privacy-select">
              <option selected value="public">
                Anyone
              </option>
              <option value="another author">Specific author</option>
              <option value="friends">Friends</option>
              <option value="mutual friends">Mutual friends</option>
              <option value="local friends">Local friends</option>
              <option value="private">Private</option>
            </select>
          </div>
          <UploadImageModal show={modalShow} onHide={handleClose} />
          <form className="make-post-input-wrapper" action="submit">
            <textarea
              placeholder="What's on your mind?"
              className="post-text-area"
              onChange={this.handleTextChange}
            />
            <div className="make-post-buttons-wrapper">
              <ImageOutlinedIcon
                className="upload-image-icon icon"
                onClick={this.renderModal}
              />
              <button
                type="submit"
                className="post-button icon"
                onClick={this.handleSubmit}
              >
                <span>POST</span>
                <SendIcon className="post-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default MakePost;
