import React, { Component } from "react";
import "../../styles/post/EditablePost.scss";
import PropTypes from "prop-types";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import TextareaAutosize from "react-textarea-autosize";
import UploadImageModal from "./UploadImageModal";
import PostPreviewModal from "./PostPreviewModal";

class EditablePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisibility: false,
      previewModalVisibility: false,
      originalPost: props.originalPost,
      postContent: props.defaultPostContent,
      postImage: props.defaultPostImage,
      postVisibility: "PUBLIC",
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

    const {
      originalPost,
      postContent,
      postImage,
      postVisibility,
    } = this.state;

    const { onSubmit } = this.props;

    originalPost.content = postContent;
    originalPost.imageSrc = postImage;
    // Temporary set title to empty
    originalPost.title = "tmp post title";
    originalPost.visibility = postVisibility;

    onSubmit(originalPost);
    this.setState({
      postContent: "",
      postImage: "",
    });
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

  changePostVisibility = (event) => {
    this.setState({
      postVisibility: event.target.value,
    });
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
      <div className="editable-post-wrapper">
        <div className="editable-post-content">
          <div className="editable-post-header">
            <b>{title}</b>
            <select className="privacy-select" defaultValue="PUBLIC" onChange={this.changePostVisibility}>
              <option value="PUBLIC">Anyone</option>
              <option value="PRIVATE">Specific author</option>
              <option value="FRIENDS">Friends</option>
              <option value="FOAF">Mutual friends</option>
              <option value="SERVERONLY">Server Only</option>
              <option value="UNLISTED">Private</option>
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
          <form className="editable-post-input-wrapper" action="submit">
            <TextareaAutosize
              ref="postTextArea"
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
            <div className="editable-post-buttons-wrapper">
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

EditablePost.propTypes = {
  editMode: PropTypes.bool,
  originalPost: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    published: PropTypes.string,
    imageSrc: PropTypes.string,
    content: PropTypes.string,
  }),
  defaultPostContent: PropTypes.string,
  defaultPostImage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onDiscard: PropTypes.func,
};

EditablePost.defaultProps = {
  editMode: false,
  originalPost: {},
  defaultPostContent: "",
  defaultPostImage: "",
  onDiscard: () => {},
};

export default EditablePost;
