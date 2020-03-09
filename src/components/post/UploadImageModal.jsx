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
    this.setState({
      errorMessage: null,
      imageFile: file[0],
    });
  }

  handleDropError = () => {
    this.setState({
      errorMessage: "Please upload a single image file",
    });
  }

  render() {
    const { onHide, show } = this.props;
    const { errorMessage, imageFile } = this.state;
    return (
      <Modal onHide={onHide} show={show} className="upload-image-modal">
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageDropzone onDropAccepted={this.handleDropAccept} onDropRejected={this.handleDropError} />
          <span className="error-message">{errorMessage}</span>
          {
            imageFile ? <img className="preview-image" src={URL.createObjectURL(imageFile)} alt="preview" /> : null
          }
        </Modal.Body>
        <Modal.Footer className="upload-button-wrapper">
          <button
            type="button"
            className="upload-button"
            onClick={onHide}
            disabled
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
