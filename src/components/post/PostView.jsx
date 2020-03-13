/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/post/PostView.scss";
import MakePost from "./MakePost";
import Post from "./Post";
import * as postService from "../../services/PostService";

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      editingPostId: null,
    };

    this.loadPosts();
  }

  loadPosts() {
    const { userId } = this.props;

    // TODO: fix else statement
    const getPosts = userId === null ? postService.getPosts() : postService.getUserPosts(userId);

    const posts = [];

    getPosts.then((response) => {
      for (let i = 0; i < response.posts.length; i += 1) {
        const newPost = {};
        const post = response.posts[i];

        newPost.username = post.author.displayName;
        newPost.content = post.content;
        newPost.published = post.published;
        newPost.id = post.id;
        newPost.imageSrc = null;

        posts.push(newPost);
      }

      this.setState({
        posts,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleEditToggle = (id) => {
    this.setState({
      editingPostId: id,
    });
  }

  handlePostUpdate = (post) => {
    this.setState((prevState) => ({
      // no longer editing the post
      editingPostId: null,
      // update post that got edited
      posts: prevState.posts.map(
        (p) => (p.id === post.id ? Object.assign(p, post) : p),
      ),
    }));
  }

  render() {
    const { editingPostId, posts } = this.state;
    const renderedPosts = [];
    for (let i = 0; i < posts.length; i += 1) {
      const post = posts[i];

      if (post.id !== editingPostId) {
        renderedPosts.push(
          <div className="postWrapper" key={post.id}>
            <Post
              post={post}
              onEdit={this.handleEditToggle}
            />
          </div>,
        );
      } else {
        renderedPosts.push(
          <div className="postWrapper" key={-1}>
            <MakePost
              editMode
              originalPost={post}
              defaultPostContent={post.content}
              defaultPostImage={post.imageSrc}
              onSubmit={this.handlePostUpdate}
              // set the current post being edited to null -> close the edit dialog
              onDiscard={() => this.handleEditToggle(null)}
            />
          </div>,
        );
      }
    }

    return (
      <div className="post-view" key={-1}>
        {renderedPosts}
      </div>
    );
  }
}


PostView.propTypes = {
  // pass in the full user id to get posts for that user only
  userId: PropTypes.string,
};

PostView.defaultProps = {
  userId: null,
};

export default PostView;
