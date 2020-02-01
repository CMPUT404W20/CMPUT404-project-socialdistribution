import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";

class PostPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="post-popup">
        <Dropdown.Item >Edit</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item >Delete</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item >Copy link to post</Dropdown.Item>
      </div>
    );
  }
}

export default PostPopup;
