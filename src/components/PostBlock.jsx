import React, { Component } from "react";
import "../styles/PostBlock.scss";
import moreIcon from "../staticfiles/more-icon.svg";
import PostPopup from "./PostPopup";

class PostBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuShownup: false
    };
    this.moreMenuOnClick = this.moreMenuOnClick.bind(this);
  }

  moreMenuOnClick() {
    this.setState({
      menuShownup: !this.state.menuShownup
    });
  }

  render() {
    return (
      <div className="post-block">
        <div className="post-info">
        <div className="post-username">{this.props.username}</div>
          <button
            id="post-button"
            type="button"
            onClick={this.moreMenuOnClick}
            onKeyDown={this.moreMenuOnClick}
          >
            <img id="post-more-icon" src={moreIcon} alt="more-icon" />
          </button>
          {this.state.menuShownup ? <PostPopup /> : null}
          <div className="post-time">{this.props.postTime}</div>
        </div>
        <img className="post-img" src={this.props.imageSrc} alt="more-icon" />
        <div className="post-content">
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default PostBlock;
