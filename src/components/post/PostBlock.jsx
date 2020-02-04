import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/post/PostBlock.scss";
import DropdownButton from "react-bootstrap/DropdownButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import PostDropDown from "./PostDropDown";
import moreIcon from "../../images/more-icon.svg";

class PostBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { username, content, imageSrc, postTime, visibleToPublic } = this.props;

    return (
      <div className="post-block">
        <div className="post-info">
          <div className="post-username">{username}</div>
          { visibleToPublic ? <VisibilityIcon /> : <VisibilityOffIcon /> }
          <DropdownButton
            id="post-more-button"
            title={<img id="post-more-icon" src={moreIcon} alt="more-icon" />}
            drop="down"
            alignRight
          >
            <PostDropDown />
          </DropdownButton>
          <div className="post-time">{postTime}</div>
        </div>
        <img className="post-img" src={imageSrc} alt="more-icon" />
        <div className="post-content">{content}</div>
      </div>
    );
  }
}

PostBlock.propTypes = {
  username: PropTypes.string.isRequired,
  postTime: PropTypes.string.isRequired,
  imageSrc: PropTypes.node,
  content: PropTypes.string,
  visibleToPublic: PropTypes.bool,
};

PostBlock.defaultProps = {
  content: "",
  imageSrc: "",
  visibleToPublic: false,
};

export default PostBlock;
