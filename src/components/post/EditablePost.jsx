import React, { Component } from "react";
import "../../styles/post/EditablePost.scss";
import PropTypes from "prop-types";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import PublicIcon from "@material-ui/icons/Public";
import TextareaAutosize from "react-textarea-autosize";
import UploadImageModal from "./UploadImageModal";
import PostPreviewModal from "./PostPreviewModal";
import PrivacySelectorModal from "./PrivacySelectorModal";
import * as postService from "../../services/PostService";

class EditablePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisibility: false,
      previewModalVisibility: false,
      privacyModalVisibility: false,
      originalPost: props.originalPost,
      postTitle: props.defaultPostTitle,
      postContent: props.defaultPostContent,
      postImage: props.defaultPostImage,
      postVisibility: props.defaultPostVisibility,
      postVisibleTo: props.defaultPostVisibleTo,
      postUnlisted: props.defaultPostUnlisted,
    };
  }

  getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
    reader.onerror = (error) => {
      // eslint-disable-next-line no-console
      console.log("Error: ", error);
    };
  }

  handleTitleChange = (event) => {
    this.setState({ postTitle: event.target.value });
  };

  handleTitleKeyPress = (event) => {
    // disable the enter key so the user can't have multi-line comments
    // can still have long text that spans multiple lines though
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  handleTextChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  handleImageUpload = (image) => {
    this.getBase64(image, (result) => {
      const fileType = image.type;
      const base64Image = result.replace(`data:${fileType};base64,`, "");

      const imageData = {
        content: base64Image,
        title: image.name,
        visibility: "PUBLIC",
        content_type: `${fileType};base64`,
      };

      postService.createUserPosts(imageData).then((response) => {
        if (response.success) {
          const imageUrl = `${window.location.href}posts/${response.uuid}`;
          const markdownImage = `![${image.name}](${imageUrl})`;

          this.setState((prevState) => ({
            postContent: prevState.postContent + markdownImage,
          }));
        }
      }).catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error);
      });
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const {
      originalPost,
      postTitle,
      postContent,
      postVisibility,
      postVisibleTo,
      postUnlisted,
    } = this.state;

    const { onSubmit } = this.props;

    originalPost.content = postContent;
    originalPost.title = postTitle;
    originalPost.visibility = postVisibility;
    originalPost.visibleTo = postVisibleTo;
    originalPost.unlisted = postUnlisted;

    onSubmit(originalPost);
    this.setState({
      postTitle: "",
      postContent: "",
      postImage: "",
      postVisibility: "PUBLIC",
      postVisibleTo: [],
      postUnlisted: false,
    });
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

  togglePrivacyModalVisibility = () => {
    this.setState((prevState) => ({
      privacyModalVisibility: !prevState.privacyModalVisibility,
    }));
  }

  handlePostVisibilityChange = (visibility, visibleTo, unlisted) => {
    this.setState({
      postVisibility: visibility,
      postVisibleTo: visibleTo,
      postUnlisted: unlisted,
      privacyModalVisibility: false,
    });
  }

  render() {
    const {
      uploadModalVisibility,
      previewModalVisibility,
      privacyModalVisibility,
      postTitle,
      postContent,
      postImage,
      postVisibility,
      postVisibleTo,
      postUnlisted,
    } = this.state;

    const { editMode, onDiscard } = this.props;

    // Marcos, https://stackoverflow.com/questions/2476382/how-to-check-if-a-textarea-is-empty-in-javascript-or-jquery
    const titleLength = postTitle.replace(/^\s+|\s+$/g, "").length;
    const postLength = postContent.replace(/^\s+|\s+$/g, "").length;
    const validPost = titleLength > 0 && (postLength > 0 || postImage !== "");

    const componentTitle = editMode ? "EDIT POST" : "NEW POST";

    return (
      <div className="editable-post-wrapper">
        <div className="editable-post-content">
          <div className="editable-post-header">
            <b>{componentTitle}</b>
          </div>
          <UploadImageModal
            show={uploadModalVisibility}
            onHide={this.toggleUploadModalVisibility}
            onUpload={this.handleImageUpload}
          />
          <PostPreviewModal
            show={previewModalVisibility}
            onHide={this.togglePreviewModalVisibility}
            postTitle={postTitle}
            postContent={postContent}
            imageObjectUrl={postImage}
          />
          <PrivacySelectorModal
            show={privacyModalVisibility}
            onHide={this.togglePrivacyModalVisibility}
            onSubmit={this.handlePostVisibilityChange}
            selectedVisibility={postVisibility}
            selectedVisibileTo={postVisibleTo}
            unlisted={postUnlisted}
          />
          <form className="editable-post-input-wrapper" action="submit">
            <TextareaAutosize
              placeholder="Title"
              className="title-text-area"
              onChange={this.handleTitleChange}
              onKeyPress={this.handleTitleKeyPress}
              value={postTitle}
            />
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
            <div className="editable-post-buttons-wrapper">
              {
                validPost ? (
                  <VisibilityRoundedIcon
                    className="icon"
                    onClick={this.togglePreviewModalVisibility}
                  />
                ) : null
              }

              <PublicIcon
                className="icon"
                onClick={this.togglePrivacyModalVisibility}
              />

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
    title: PropTypes.string,
    authorId: PropTypes.string,
    username: PropTypes.string,
    published: PropTypes.string,
    content: PropTypes.string,
  }),
  defaultPostTitle: PropTypes.string,
  defaultPostContent: PropTypes.string,
  defaultPostImage: PropTypes.string,
  defaultPostVisibility: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  defaultPostVisibleTo: PropTypes.array,
  defaultPostUnlisted: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onDiscard: PropTypes.func,
};

EditablePost.defaultProps = {
  editMode: false,
  originalPost: {},
  defaultPostTitle: "",
  defaultPostContent: "",
  defaultPostImage: "",
  defaultPostVisibility: "PUBLIC",
  defaultPostVisibleTo: [],
  defaultPostUnlisted: false,
  onDiscard: () => {},
};

export default EditablePost;
