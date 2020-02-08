import React from "react";
import "../../styles/post/PostDropDown.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import editIcon from "../../images/edit-pencil.svg";
import deleteIcon from "../../images/del-bin.svg";
import linkIcon from "../../images/link.svg";

const PostDropDown = () => (
  <div>
    <Dropdown.Item>
      {/* <img src={editIcon} alt="pencil-icon" /> */}
      <span className="post-dropdown-text">Edit</span>
    </Dropdown.Item>
    <Dropdown.Item>
      {/* <img src={deleteIcon} alt="del-icon" /> */}
      <span className="post-dropdown-text">Delete</span>
    </Dropdown.Item>
    <Dropdown.Item>
      {/* <img src={linkIcon} alt="link-icon" /> */}
      <span className="post-dropdown-text">Copy link to post</span>
    </Dropdown.Item>

    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
  </div>
);

export default PostDropDown;
