import React, { Component } from "react";
import "../../styles/post/MakePost.scss";
import PropTypes from "prop-types";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import TextareaAutosize from "react-textarea-autosize";
import UploadImageModal from "./UploadImageModal";
import PostPreviewModal from "./PostPreviewModal";

class MakePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisibility: false,
      previewModalVisibility: false,
      originalPost: props.originalPost,
      postContent: props.defaultPostContent,
      postImage: props.defaultPostImage,
    };
  }

  handleTextChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  handleImageUpload = (image) => {
    this.setState({ postImage: URL.createObjectURL(image) });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { originalPost, postContent, postImage } = this.state;
    const { onSubmit } = this.props;

    originalPost.content = postContent;
    originalPost.imageSrc = postImage;

    onSubmit(originalPost);
    // eslint-disable-next-line no-alert
    // alert(postContent);
  };

  toggleUploadModalVisibility = () => {
    this.setState((prevState) => ({
      uploadModalVisibility: !prevState.uploadModalVisibility,
    }));
  }

  togglePreviewModalVisibility = () => {
    this.setState((prevState) => ({
      previewModalVisibility: !prevState.previewModalVisibility,
    }));
  }

  render() {
    const {
      uploadModalVisibility,
      previewModalVisibility,
      postContent,
      postImage,
    } = this.state;

    const { editMode, onDiscard } = this.props;

    // Marcos, https://stackoverflow.com/questions/2476382/how-to-check-if-a-textarea-is-empty-in-javascript-or-jquery
    const postLength = postContent.replace(/^\s+|\s+$/g, "").length;
    const validPost = postLength > 0 || postImage !== "";

    const title = editMode ? "EDIT POST" : "NEW POST";

    return (
      <div className="make-post-wrapper">
        <div className="make-post-content">
          <div className="make-post-header">
            <b>{title}</b>
            <select className="privacy-select" defaultValue="public">
              <option value="public">Anyone</option>
              <option value="another-author">Specific author</option>
              <option value="friends">Friends</option>
              <option value="mutual-friends">Mutual friends</option>
              <option value="local-friends">Local friends</option>
              <option value="private">Private</option>
            </select>
          </div>
          <UploadImageModal
            show={uploadModalVisibility}
            onHide={this.toggleUploadModalVisibility}
            onUpload={this.handleImageUpload}
          />
          <PostPreviewModal
            show={previewModalVisibility}
            onHide={this.togglePreviewModalVisibility}
            postContent={postContent}
            imageObjectUrl={postImage}
          />
          <form className="make-post-input-wrapper" action="submit">
            <TextareaAutosize
              placeholder="What's on your mind?"
              className="post-text-area"
              onChange={this.handleTextChange}
              value={postContent}
            />
            {
              postImage ? (
                <img src={postImage} className="preview-image" alt="preview" />
              ) : null
            }
            <div className="make-post-buttons-wrapper">
              {
                validPost ? (
                  <VisibilityRoundedIcon
                    className="icon"
                    onClick={this.togglePreviewModalVisibility}
                  />
                ) : null
              }

              <ImageOutlinedIcon
                className="icon"
                onClick={this.toggleUploadModalVisibility}
              />
              {
                editMode ? (
                  <button
                    type="submit"
                    className="discard-button"
                    onClick={onDiscard}
                  >
                    Discard
                  </button>
                ) : null
              }
              <button
                type="submit"
                className="post-button"
                onClick={this.handleSubmit}
                disabled={!validPost}
              >
                { editMode ? "Update" : "Post" }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

MakePost.propTypes = {
  editMode: PropTypes.bool,
  originalPost: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    postTime: PropTypes.instanceOf(Date),
    imageSrc: PropTypes.string,
    content: PropTypes.string,
  }),
  defaultPostContent: PropTypes.string,
  defaultPostImage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onDiscard: PropTypes.func,
};

MakePost.defaultProps = {
  editMode: false,
  originalPost: {},
  defaultPostContent: "",
  defaultPostImage: "",
  onDiscard: () => {},
};

export default MakePost;
