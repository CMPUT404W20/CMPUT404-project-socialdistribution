import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Fade from "react-reveal/Fade";
import "../../styles/post/Post.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import Collapse from "react-bootstrap/Collapse";
import moreIcon from "../../images/more-icon.svg";
import * as CommentService from "../../services/CommentService";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentSectionVisisble: false,
      newComment: "",
    };
  }

  renderMenu = () => {
    const {
      post,
      invisible,
      previewMode,
      onEdit,
      onDelete,
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
          <Fade left duration={500} distance="5px">
            <Dropdown.Item onClick={() => onEdit(post.id)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(post.id)}>Delete</Dropdown.Item>
            <Dropdown.Item href="#">Copy Link</Dropdown.Item>
          </Fade>
        </DropdownButton>
        <div className="post-time">{formattedTime}</div>
      </div>
    );
  }

  renderComments = () => {
    const { post } = this.props;

    return (
      <div id="comment-list">
        {post.comments.map((comment) => (
          <div key={comment.id}>
            <p>
              {`${comment.author.displayName}:`}
              <span className="comment-content">{comment.comment}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  handleCommentTextChange = (event) => {
    this.setState({ newComment: event.target.value });
  }

  handleSubmitNewComment = () => {
    const { newComment } = this.state;
    const { post } = this.props;

    CommentService.createComment(post.id, newComment).then((success) => {
      if (success) {
        this.setState({
          newComment: "",
        });
      }
    }).catch((err) => {
      const error = err.response.data;
      // eslint-disable-next-line no-console
      console.log(error);
    });
  }

  handleCommentKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSubmitNewComment();
    }
  }

  toggleCommentSection = () => {
    const { post } = this.props;
    if (post.comments.length > 0) {
      this.setState((prevState) => ({
        commentSectionVisisble: !prevState.commentSectionVisisble,
      }));
    }
  }

  renderCommentSection = () => {
    const { previewMode } = this.props;
    if (previewMode) {
      return null;
    }
    const { commentSectionVisisble, newComment } = this.state;
    const { post } = this.props;
    return (
      <div>
        <button
          className="post-show-comment"
          onClick={this.toggleCommentSection}
          aria-controls="post-comments"
          aria-expanded={commentSectionVisisble}
          type="button"
        >
          {post.comments.length}
          {" "}
          {post.comments.length === 1 ? "comment" : "comments"}
        </button>
        <Collapse in={commentSectionVisisble}>
          {/* this div is necessary to prevent a choppy animation when opening the comments */}
          <div>
            {this.renderComments()}
          </div>
        </Collapse>
        <form className="make-comment-input-wrapper" action="submit" onSubmit={this.handleSubmitNewComment}>
          <TextareaAutosize
            placeholder="Add a comment"
            className="post-comment-text-area"
            onChange={this.handleCommentTextChange}
            onKeyPress={this.handleCommentKeyPress}
            value={newComment}
          />
        </form>
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
    comments: PropTypes.array,
  }).isRequired,
  invisible: PropTypes.bool,
  previewMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

Post.defaultProps = {
  invisible: false,
  previewMode: false,
  onEdit: null,
  onDelete: null,
};

export default Post;
