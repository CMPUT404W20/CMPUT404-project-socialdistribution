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
      commentList: [{ id: "1", username: "abc", content: "good!" },
        { id: "2", username: "imUser2", content: "This HTML file is a template.If you open it directly in the browser, you will see an empty page. You can add webfonts, meta tags, or analytics to this file." },
        { id: "3", username: "chubby bunny", content: "ahhhhhhhh i want bubble tttttttt!!!" }],
      newComment: "",
    };
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
    const formattedTime = moment(post.published).fromNow();

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

  renderComments = () => {
    const { commentList } = this.state;
    return (
      <div id="comment-list">
        {commentList.map((comment) => (
          <div key={comment.id}>
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

  renderCommentSection = () => {
    const { previewMode } = this.props;
    if (previewMode) {
      return null;
    }
    const { commentsOpen, commentList, newComment } = this.state;
    return (
      <div>
        <button
          className="post-show-comment"
          onClick={() => this.setState({ commentsOpen: !commentsOpen })}
          aria-controls="post-comments"
          aria-expanded={commentsOpen}
          type="button"
        >
          {commentList.length}
          {" "}
          comments
        </button>
        <Collapse in={commentsOpen}>
          {this.renderComments()}
        </Collapse>
        <form className="make-comment-input-wrapper" action="submit" onSubmit={this.handleSubmitNewComment}>
          <TextareaAutosize
            placeholder="Add a comment"
            className="post-comment-text-area"
            onChange={this.handleTextChange}
            onKeyPress={this.keyPressed}
            value={newComment}
          />
        </form>
      </div>
    );
  }

  handleTextChange = (event) => {
    this.setState({ newComment: event.target.value });
  }

  handleSubmitNewComment = () => {
    // todo: post new comment to api
    this.setState({ newComment: "" });
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSubmitNewComment();
    }
  }

  render() {
    const { post } = this.props;
    return (
      <div className="post-block">
        {this.renderMenu()}
        { post.imageSrc ? <img className="post-img" src={post.imageSrc} alt="more-icon" /> : null }
        <ReactMarkdown className="post-content" plugins={[breaks]} source={post.content} />
        {this.renderCommentSection()}
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    published: PropTypes.string.isRequired,
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
