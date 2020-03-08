/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import "../../styles/post/UploadImageModal.scss";
import Modal from "react-bootstrap/Modal";

function ImageDropzone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    props.onDrop(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: "image/*", onDrop, multiple: false });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop some files here, or click to select files</p>
      }
    </div>
  );
}

function UploadImageModal(props) {
  const { onHide, show } = props;

  return (
    <Modal onHide={onHide} show={show} className="upload-image-modal">
      <Modal.Header closeButton>
        <Modal.Title>Upload Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ImageDropzone onDrop={console.log} />
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

ImageDropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

UploadImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default UploadImageModal;
