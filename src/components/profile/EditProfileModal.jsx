import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/profile/EditProfileModal.scss";
import Modal from "react-bootstrap/Modal";
import { withRouter } from "react-router-dom";
import * as auth from "../../services/AuthenticationService";

class EditProfileModal extends Component {
  constructor(props) {
    super(props);
    const { currentUser } = this.props;
    this.state = {
      github: currentUser.github,
      password1: "",
      password2: "",
      errorGithub: "",
      errorPwd: "",
    };
  }

  handleGithubChange = (event) => {
    this.setState({ github: event.target.value });
  }

  handlePassword1Change = (event) => {
    this.setState({ password1: event.target.value });
  }

    handlePassword2Change = (event) => {
      this.setState({ password2: event.target.value });
    }

  handleUpdateProfile = () => {
    const { github, password1 } = this.state;
    const passwordChanged = password1 !== "";
    const { history } = this.props;
    auth.updateUserProfile(github, password1).then((response) => {
      if (response.status === 200) {
        // Need to login again after updating pwd
        if (passwordChanged) {
          history.push("/login");
        }
        // Remount profile page when github url changes
        window.location.reload();
      }
    }).catch((err) => {
      this.setState({ errorPwd: err });
    });
  }

  validateForm = () => {
    const { github, password1, password2 } = this.state;
    let urlValidator;
    let errorPwd = "";
    let errorGithub = "";
    if (github !== "") {
      try {
        urlValidator = new URL(github);
      } catch (e) {
      // Not valid URL
        errorGithub = "Invalid github URL.";
      }
      // Check github url format
      if (urlValidator && (urlValidator.protocol !== "https:" || urlValidator.host !== "github.com")) {
        errorGithub = "Invalid github URL.";
      }
    }

    if (password1 !== password2) {
      errorPwd = "Passwords don't match.";
    }
    if (password1 !== "" && password1.length < 8) {
      errorPwd = "Password must be at least 8 characters long.";
    }

    this.setState({ errorGithub, errorPwd }, () => {
      if (errorGithub === "" && errorPwd === "") {
        this.handleUpdateProfile();
      }
    });
  }

  render() {
    const { onHide, show, currentUser } = this.props;
    const {
      github, password1, password2, errorGithub, errorPwd,
    } = this.state;
    return (
      <Modal onHide={onHide} show={show} className="edit-profile-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            disabled
            type="text"
            name="username"
            value={currentUser.displayName}
            placeholder="Display Name"
          />

          <input
            type="text"
            name="github"
            value={github}
            placeholder="Github URL"
            onChange={(e) => this.handleGithubChange(e)}
          />

          <input
            type="password"
            name="password"
            value={password1}
            placeholder="Password"
            onChange={(e) => this.handlePassword1Change(e)}
          />

          <input
            type="password"
            name="password"
            value={password2}
            placeholder="Re-enter your password"
            onChange={(e) => this.handlePassword2Change(e)}
          />

        </Modal.Body>
        <p className="error-message">{errorGithub}</p>
        <p className="error-message">{errorPwd}</p>
        <Modal.Footer className="save-button-wrapper">
          <button
            type="button"
            className="save-button"
            onClick={() => this.validateForm()}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditProfileModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
  history: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
};

export default withRouter(EditProfileModal);
