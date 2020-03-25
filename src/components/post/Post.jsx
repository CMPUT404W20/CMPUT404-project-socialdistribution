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
      // add some gap at the top that would normally have been used by the menu bar
      // without this, the preview looks cramped
      return (<div className="spacer" />);
    }

    const dropdownIcon = <img id="post-more-icon" src={moreIcon} alt="more-icon" />;
    const formattedTime = moment(post.published).fromNow();

    const isEditable = post.authorId === localStorage.getItem("userID");

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
            {/* the following enclosing tag is required for the fade to work properly */}
            <>
              {
                isEditable ? (
                  <>
                    <Dropdown.Item onClick={() => onEdit(post.id)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(post.id)}>Delete</Dropdown.Item>
                  </>
                ) : null
              }
              <Dropdown.Item href="#">Copy Link</Dropdown.Item>
            </>
          </Fade>
        </DropdownButton>
        <div className="post-time">{formattedTime}</div>
      </div>
    );
  }

  renderComments = () => {
    const { post } = this.props;
    const comments = [];

    post.comments.forEach((comment) => {
      const opComment = comment.author.id === post.authorId;

      comments.push(
        <div key={comment.id}>
          <p>
            <span className={opComment ? "op" : ""}>{`${comment.author.displayName}:`}</span>
            <span className="comment-content">{comment.comment}</span>
          </p>
        </div>,
      );
    });

    return comments;
  }

  handleCommentTextChange = (event) => {
    this.setState({ newComment: event.target.value });
  }

  handleSubmitNewComment = () => {
    const { newComment } = this.state;
    const { post, onNewComment } = this.props;

    CommentService.createComment(post.id, newComment).then((success) => {
      if (success) {
        // clear the comment field but open the comment section so the user can see the created post
        this.setState({
          newComment: "",
          commentSectionVisisble: true,
        });

        onNewComment();
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
            <div className="comment-list">
              {this.renderComments()}
            </div>
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
        <h5 className="post-title"><em>{post.title}</em></h5>
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
    authorId: PropTypes.string.isRequired,
    published: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    imageSrc: PropTypes.string,
    comments: PropTypes.array,
    isGithubPost: PropTypes.bool,
  }).isRequired,
  invisible: PropTypes.bool,
  previewMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onNewComment: PropTypes.func,
};

Post.defaultProps = {
  invisible: false,
  previewMode: false,
  onEdit: null,
  onDelete: null,
  onNewComment: null,
};

export default Post;
