/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";
import Pulse from "react-reveal/Pulse";
import "../../styles/post/PostView.scss";
import EditablePost from "./EditablePost";
import Post from "./Post";
import * as postService from "../../services/PostService";

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      editingPostId: null,
      loading: true,
    };

    this.loadPosts();
  }

  loadPosts() {
    const { userId } = this.props;

    // userId === null means it's rendering homepage and not the profile page
    const getPosts = userId === null ? postService.getPosts() : postService.getUserPosts(userId);

    const posts = [];

    getPosts.then((response) => {
      for (let i = 0; i < response.posts.length; i += 1) {
        const newPost = {};
        const post = response.posts[i];

        newPost.username = post.author.displayName;
        newPost.authorId = post.author.id;
        newPost.title = post.title;
        newPost.content = post.content;
        newPost.published = post.published;
        newPost.id = post.id;
        newPost.imageSrc = null;
        newPost.comments = post.comments || [];

        posts.push(newPost);
      }

      this.setState({
        posts,
        loading: false,
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
    postService.updateUserPosts(post).then(() => {
      this.setState((prevState) => ({
        // no longer editing the post
        editingPostId: null,
        // update post that got edited
        posts: prevState.posts.map(
          (p) => (p.id === post.id ? Object.assign(p, post) : p),
        ),
      }));
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleDelete = (postID) => {
    postService.deleteUserPosts(postID).then(() => {
      this.setState((prevState) => ({
        // remove delete posts from state
        posts: prevState.posts.filter(
          (p) => (p.id !== postID),
        ),
      }));
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleNewComment = () => {
    // refresh the posts list to render the latest data
    this.loadPosts();
  }

  render() {
    const { editingPostId, posts, loading } = this.state;

    if (loading) {
      return <div />;
    }

    const renderedPosts = [];
    for (let i = 0; i < posts.length; i += 1) {
      const post = posts[i];

      if (post.id !== editingPostId) {
        renderedPosts.push(
          <div className="postWrapper" key={post.id}>
            <Post
              post={post}
              onEdit={this.handleEditToggle}
              onDelete={this.handleDelete}
              onNewComment={this.handleNewComment}
            />
          </div>,
        );
      } else {
        renderedPosts.push(
          <Pulse duration={200}>
            <div className="postWrapper" key={-1}>
              <EditablePost
                editMode
                originalPost={post}
                defaultPostTitle={post.title}
                defaultPostContent={post.content}
                defaultPostImage={post.imageSrc}
                onSubmit={this.handlePostUpdate}
                // set the current post being edited to null -> close the edit dialog
                onDiscard={() => this.handleEditToggle(null)}
              />
            </div>
          </Pulse>,
        );
      }
    }

    return (
      <Fade bottom duration={1000} distance="100px">
        <div className="post-view" key={-1}>
          {renderedPosts}
        </div>
      </Fade>
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
