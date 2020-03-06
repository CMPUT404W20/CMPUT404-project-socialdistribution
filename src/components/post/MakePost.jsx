import React, { Component } from "react";
import "../../styles/post/MakePost.scss";
import SendIcon from "@material-ui/icons/Send";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import UploadImageModal from "./UploadImageModal";

class MakePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModalVisibility: false,
      post: "",
    };
  }

  handleTextChange = (event) => {
    this.setState({ post: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { post } = this.state;
    // eslint-disable-next-line no-alert
    alert(post);
  };

  toggleUploadModalVisibility = () => {
    this.setState((prevState) => ({
      uploadModalVisibility: !prevState.uploadModalVisibility,
    }));
  }

  render() {
    const { uploadModalVisibility } = this.state;
    return (
      <div className="make-post-wrapper">
        <div className="make-post-content">
          <div className="make-post-header">
            <b>NEW POST</b>
            <select className="privacy-select">
              <option selected value="public">
                Anyone
              </option>
              <option value="another author">Specific author</option>
              <option value="friends">Friends</option>
              <option value="mutual friends">Mutual friends</option>
              <option value="local friends">Local friends</option>
              <option value="private">Private</option>
            </select>
          </div>
          <UploadImageModal show={uploadModalVisibility} onHide={this.toggleUploadModalVisibility} />
          <form className="make-post-input-wrapper" action="submit">
            <textarea
              placeholder="What's on your mind?"
              className="post-text-area"
              onChange={this.handleTextChange}
            />
            <div className="make-post-buttons-wrapper">
              <ImageOutlinedIcon
                className="upload-image-icon icon"
                onClick={this.toggleUploadModalVisibility}
              />
              <button
                type="submit"
                className="post-button icon"
                onClick={this.handleSubmit}
              >
                <span>POST</span>
                <SendIcon className="post-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default MakePost;
