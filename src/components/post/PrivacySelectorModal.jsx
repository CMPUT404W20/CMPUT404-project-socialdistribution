import React from "react";
import PropTypes from "prop-types";
import "../../styles/post/PrivacySelectorModal.scss";
import Modal from "react-bootstrap/Modal";

function PrivacySelectorModal(props) {
  const {
    onHide,
    show,
  } = props;

  return (
    <Modal size="lg" onHide={onHide} show={show} className="privacy-selector-modal">
      <Modal.Body>
        Some privacy
      </Modal.Body>
    </Modal>
  );
}

PrivacySelectorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

PrivacySelectorModal.defaultProps = {
};

export default PrivacySelectorModal;
