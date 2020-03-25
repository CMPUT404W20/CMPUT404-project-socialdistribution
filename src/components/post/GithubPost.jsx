import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "../../styles/post/Post.scss";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import githubIcon from "../../images/GitHub-Mark-32px.png";

class GithubPost extends Component {
  renderMenu = () => {
    const { post } = this.props;

    const formattedTime = moment(post.published).fromNow();

    return (
      <div className="post-info">
        <span className="post-user-and-visibility">
          <img className="github-icon" src={githubIcon} alt="github-icon" />
          {post.username}
        </span>
        <div className="post-time">{formattedTime}</div>
      </div>
    );
  }

  render() {
    const { post } = this.props;
    return (
      <div className="post-block github">
        {this.renderMenu()}
        <ReactMarkdown className="post-content" plugins={[breaks]} source={post.content} />
      </div>
    );
  }
}

GithubPost.propTypes = {
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
};


export default GithubPost;
