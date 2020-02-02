import React, { Component } from "react";
import "../styles/PostDropDown.scss";
import Dropdown from "react-bootstrap/Dropdown";
import editIcon from "../staticfiles/edit-pencil.svg";
import deleteIcon from "../staticfiles/del-bin.svg"
import linkIcon from "../staticfiles/link.svg"

class PostDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Dropdown.Item className="post-dropdown-item">
          <img src={editIcon} alt="pencil-icon" />
          <span className="post-dropdown-text">Edit</span>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="post-dropdown-item">
          <img src={deleteIcon} alt="del-icon" />
          <span className="post-dropdown-text">Delete</span>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="post-dropdown-item">
          <img src={linkIcon} alt="link-icon" />
          <span className="post-dropdown-text">Copy link to post</span>
        </Dropdown.Item>
      </div>
    );
  }
}

export default PostDropDown;
