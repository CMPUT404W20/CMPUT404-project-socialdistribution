import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "../../styles/post/PostBlock.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import moreIcon from "../../images/more-icon.svg";

class PostBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      username,
      content,
      imageSrc,
      postTime,
      invisible,
    } = this.props;

    const dropdownIcon = <img id="post-more-icon" src={moreIcon} alt="more-icon" />;
    const formattedTime = moment(postTime).fromNow();

    return (
      <div className="post-block">
        <div className="post-info">
          <span className="post-user-and-visibility">
            {username}
            { invisible ? <VisibilityOffIcon fontSize="inherit" /> : null }
          </span>
          <DropdownButton
            id="post-more-button"
            title={dropdownIcon}
            drop="down"
            alignRight
          >
            <Dropdown.Item href="#">Edit</Dropdown.Item>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
            <Dropdown.Item href="#">Copy Link</Dropdown.Item>
          </DropdownButton>

          <div className="post-time">{formattedTime}</div>
        </div>
        {/* TODO: need to make it not render image if there is none provided */}
        <img className="post-img" src={imageSrc} alt="more-icon" />
        <div className="post-content">{content}</div>
      </div>
    );
  }
}

PostBlock.propTypes = {
  username: PropTypes.string.isRequired,
  postTime: PropTypes.instanceOf(Date).isRequired,
  imageSrc: PropTypes.node,
  content: PropTypes.string,
  invisible: PropTypes.bool,
};

PostBlock.defaultProps = {
  content: "",
  imageSrc: "",
  invisible: false,
};

export default PostBlock;
