import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "../../styles/post/Post.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import Collapse from "react-bootstrap/Collapse";
import moreIcon from "../../images/more-icon.svg";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsOpen: false,
      comments: [{ username: "abc", content: "good!" },
        { username: "imUser2", content: "This HTML file is a template.If you open it directly in the browser, you will see an empty page. You can add webfonts, meta tags, or analytics to this file." },
        { username: "chubby bunny", content: "ahhhhhhhh i want bubble tttttttt!!!" }],
    };
  }

  renderMenu = () => {
    const {
      username,
      postTime,
      invisible,
      previewMode,
    } = this.props;

    if (previewMode) {
      return null;
    }

    const dropdownIcon = <img id="post-more-icon" src={moreIcon} alt="more-icon" />;
    const formattedTime = moment(postTime).fromNow();

    return (
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
    );
  }

  renderComments = () => {
    const { comments } = this.state;
    return (
      <div id="comment-list">
        {comments.map((comment, index) => (
          <div key={index}>
            <p>
              {comment.username}
              {" "}
              :
              <span className="comment-content">{comment.content}</span>
            </p>
          </div>
        ))}
      </div>

    );
  }

  render() {
    const {
      content,
      imageSrc,
    } = this.props;
    const { commentsOpen, comments } = this.state;
    return (
      <div className="post-block">
        {this.renderMenu()}
        { imageSrc ? <img className="post-img" src={imageSrc} alt="more-icon" /> : null }
        <ReactMarkdown className="post-content" plugins={[breaks]} source={content} />
        <button
          className="post-show-comment"
          onClick={() => this.setState({ commentsOpen: !commentsOpen })}
          aria-controls="post-comments"
          aria-expanded={commentsOpen}
          type="button"
        >
          {comments.length}
          {" "}
          comments
        </button>
        <Collapse in={commentsOpen}>
          {this.renderComments()}
        </Collapse>
        <TextareaAutosize
          placeholder="Add a comment"
          className="post-comment-text-area"
        />
      </div>
    );
  }
}

Post.propTypes = {
  username: PropTypes.string.isRequired,
  postTime: PropTypes.instanceOf(Date).isRequired,
  imageSrc: PropTypes.node,
  content: PropTypes.string,
  invisible: PropTypes.bool,
  previewMode: PropTypes.bool,
};

Post.defaultProps = {
  content: "",
  imageSrc: null,
  invisible: false,
  previewMode: false,
};

export default Post;
