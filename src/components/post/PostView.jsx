/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";
import Pulse from "react-reveal/Pulse";
import "../../styles/post/PostView.scss";
import EditablePost from "./EditablePost";
import Post from "./Post";
import GithubPost from "./GithubPost";
import * as postService from "../../services/PostService";

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      editingPostId: null,
      loading: true,
    };
    const { postId } = this.props;
    if (postId) {
      this.loadSinglePost();
    } else {
      this.loadPosts();
    }
  }

  loadSinglePost() {
    const { postId } = this.props;

    postService.getSinglePost(postId).then((response) => {
      const singlePost = response.posts[0];
      const newPost = {};
      const posts = [];

      newPost.username = singlePost.author.displayName;
      newPost.authorId = singlePost.author.id;
      newPost.title = singlePost.title;
      newPost.content = singlePost.content;
      newPost.published = singlePost.published;
      newPost.id = singlePost.id;
      newPost.source = singlePost.source;
      newPost.comments = singlePost.comments || [];
      newPost.isGithubPost = singlePost.isGithubPost || false;

      posts.push(newPost);

      this.setState({
        posts,
        loading: false,
      });
    }).catch(() => {
      // eslint-disable-next-line no-alert
      return (
        <p>Not a Post</p>
      );
    });
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

        if (!post.unlisted && !post.content_type.includes("image")) {
          newPost.username = post.author.displayName;
          newPost.authorId = post.author.id;
          newPost.title = post.title;
          newPost.content = post.content;
          newPost.published = post.published;
          newPost.id = post.id;
          newPost.source = post.source;
          newPost.comments = post.comments || [];
          newPost.isGithubPost = post.isGithubPost || false;

          posts.push(newPost);
        }
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

      if (post.isGithubPost) {
        renderedPosts.push(
          <div className="postWrapper" key={post.id}>
            <GithubPost
              post={post}
            />
          </div>,
        );
      } else if (post.id === editingPostId) {
        // this post is being edited currently
        renderedPosts.push(
          <Pulse duration={200}>
            <div className="postWrapper" key={-1}>
              <EditablePost
                editMode
                originalPost={post}
                defaultPostTitle={post.title}
                defaultPostContent={post.content}
                onSubmit={this.handlePostUpdate}
                // set the current post being edited to null -> close the edit dialog
                onDiscard={() => this.handleEditToggle(null)}
              />
            </div>
          </Pulse>,
        );
      } else {
        // regular posts
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
  postId: PropTypes.string,
};

PostView.defaultProps = {
  userId: null,
  postId: "",
};

export default PostView;
