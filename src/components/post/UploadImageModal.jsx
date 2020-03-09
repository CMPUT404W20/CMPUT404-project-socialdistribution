/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import "../../styles/post/UploadImageModal.scss";
import Modal from "react-bootstrap/Modal";

function ImageDropzone(props) {
  const { onDropAccepted, onDropRejected } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: "image/*", onDropAccepted, multiple: false, onDropRejected });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop some files here, or click to select files</p>
      }
    </div>
  );
}

class UploadImageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      imageFile: null,
    };
  }

  handleDropAccept = (file) => {
    this.revokeUrl();
    this.setState({
      errorMessage: null,
      imageFile: file[0],
    });
  }

  handleDropError = () => {
    this.revokeUrl();
    this.setState({
      errorMessage: "Please upload a single image file",
      imageFile: null,
    });
  }

  onUpload = () => {
    this.hideModal();
  }

  revokeUrl = () => {
    // need to revoke the object URL to prevent memory leaks
    const { imageFile } = this.state;
    URL.revokeObjectURL(imageFile);
  }

  hideModal = () => {
    // clear out the modal contents so that the modal is empty next time
    const { onHide } = this.props;
    onHide(); // the default behaviour

    setTimeout(() => {
      this.setState({
        errorMessage: null,
        imageFile: null,
      });
      this.revokeUrl();
    }, 500);
  }

  render() {
    const { show } = this.props;
    const { errorMessage, imageFile } = this.state;
    return (
      <Modal onHide={this.hideModal} show={show} className="upload-image-modal">
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageDropzone onDropAccepted={this.handleDropAccept} onDropRejected={this.handleDropError} />
          <div className="error-message">{errorMessage}</div>
          {
            imageFile ? <img className="preview-image" src={URL.createObjectURL(imageFile)} alt="preview" /> : null
          }
        </Modal.Body>
        <Modal.Footer className="upload-button-wrapper">
          <button
            type="button"
            className="upload-button"
            onClick={this.onUpload}
            disabled={imageFile === null}
          >
            Upload
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ImageDropzone.propTypes = {
  onDropAccepted: PropTypes.func.isRequired,
  onDropRejected: PropTypes.func.isRequired,
};

UploadImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default UploadImageModal;
