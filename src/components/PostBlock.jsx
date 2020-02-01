import React, { Component } from "react";
import "../styles/PostBlock.scss";
import moreIcon from "../staticfiles/more-icon.svg";
import demoImage from "../staticfiles/demo-img.png";
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
    // const { currentState } = this.state;
    // console.log(currentState);


    this.setState({
      menuShownup: !this.state.menuShownup
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className="post-block">
        <div className="post-info">
          <div className="post-username">test user</div>
          <button
            id="post-button"
            type="button"
            onClick={this.moreMenuOnClick}
            onKeyDown={this.moreMenuOnClick}
          >
            <img id="post-more-icon" src={moreIcon} alt="more-icon" />
          </button>
          {this.state.menuShownup ? <PostPopup /> : null}
          <div className="post-time">10 hours ago</div>
        </div>
        <img className="post-img" src={demoImage} alt="more-icon" />
        <div className="post-content">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </div>
      </div>
    );
  }
}

export default PostBlock;
