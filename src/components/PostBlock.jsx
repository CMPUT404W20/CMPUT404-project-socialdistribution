import React, { Component } from "react";
import "../styles/PostBlock.scss";
import moreIcon from "../staticfiles/more-icon.svg";
import PostPopup from "./PostDropDown";
import DropdownButton from "react-bootstrap/DropdownButton";

class PostBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="post-block">
        <div className="post-info">
          <div className="post-username">{this.props.username}</div>
          <DropdownButton
            id="post-button"
            title={<img id="post-more-icon" src={moreIcon} alt="more-icon" />}
            drop="down"
            alignRight
          >
            <PostPopup />
          </DropdownButton>

          <div className="post-time">{this.props.postTime}</div>
        </div>
        <img className="post-img" src={this.props.imageSrc} alt="more-icon" />
        <div className="post-content">{this.props.content}</div>
      </div>
    );
  }
}

export default PostBlock;
