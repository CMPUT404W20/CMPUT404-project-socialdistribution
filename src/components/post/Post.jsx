import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "../../styles/post/Post.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import moreIcon from "../../images/more-icon.svg";

class Post extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  renderMenu = () => {
    const {
      post,
      invisible,
      previewMode,
      onEdit,
    } = this.props;

    if (previewMode) {
      return null;
    }

    const dropdownIcon = <img id="post-more-icon" src={moreIcon} alt="more-icon" />;
    const formattedTime = moment(post.postTime).fromNow();

    return (
      <div className="post-info">
        <span className="post-user-and-visibility">
          {post.username}
          { invisible ? <VisibilityOffIcon fontSize="inherit" /> : null }
        </span>
        <DropdownButton
          id="post-more-button"
          title={dropdownIcon}
          drop="down"
          alignRight
        >
          <Dropdown.Item onClick={() => onEdit(post.id)}>Edit</Dropdown.Item>
          <Dropdown.Item href="#">Delete</Dropdown.Item>
          <Dropdown.Item href="#">Copy Link</Dropdown.Item>
        </DropdownButton>
        <div className="post-time">{formattedTime}</div>
      </div>
    );
  }

  render() {
    const { post } = this.props;

    return (
      <div className="post-block">
        {this.renderMenu()}
        { post.imageSrc ? <img className="post-img" src={post.imageSrc} alt="more-icon" /> : null }
        <ReactMarkdown className="post-content" plugins={[breaks]} source={post.content} />
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    postTime: PropTypes.instanceOf(Date).isRequired,
    imageSrc: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  invisible: PropTypes.bool,
  previewMode: PropTypes.bool,
  onEdit: PropTypes.func,
};

Post.defaultProps = {
  invisible: false,
  previewMode: false,
  onEdit: null,
};

export default Post;
