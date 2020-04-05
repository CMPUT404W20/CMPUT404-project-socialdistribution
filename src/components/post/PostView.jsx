/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";
import Pulse from "react-reveal/Pulse";
import InfiniteScroll from "react-infinite-scroller";
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
      hasMoreItems: true, // used by InfiniteScroll to determine if there are more posts to load
    };
    const { postId } = this.props;
    if (postId) {
      this.loadSinglePost();
    }
  }

  loadSinglePost() {
    const { postId } = this.props;

    postService.getSinglePost(postId).then((post) => {
      const parsedPosts = this.parsePosts([post]);
      this.setState({
        posts: parsedPosts,
      });
    }).catch(() => (
      <p>Not a Post</p>
    ));
  }

  parsePosts = (posts) => {
    const parsedPosts = [];

    for (let i = 0; i < posts.length; i += 1) {
      const newPost = {};
      const post = posts[i];

      newPost.username = post.author.displayName;
      newPost.authorId = post.author.id || "";
      newPost.authorHost = post.author.host || "";
      newPost.title = post.title;
      newPost.content = post.content;
      newPost.published = post.published;
      newPost.id = post.id;
      newPost.source = post.source;
      newPost.comments = post.comments || [];
      newPost.isGithubPost = post.isGithubPost || false;
      newPost.visibility = post.visibility || "PUBLIC";
      newPost.visibleTo = post.visibleTo || [];
      newPost.unlisted = post.unlisted || false;

      parsedPosts.push(newPost);
    }

    return parsedPosts;
  }

  loadMorePosts = (page) => {
    const { userId } = this.props;
    const { posts } = this.state;

    // userId === null means it's rendering homepage and not the profile page
    const getPostsPromise = userId === null ? postService.getPostsByPage(page, 10) : postService.getUserPosts(userId);
    let newPosts = posts.slice();

    getPostsPromise.then((response) => {
      const parsedPosts = this.parsePosts(response.posts);
      newPosts = newPosts.concat(parsedPosts);

      this.setState({
        posts: newPosts,
        hasMoreItems: response.next !== null,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }


  reloadPosts = () => {
    // load one page of posts of size state.posts.length to update all visible posts
    const { userId } = this.props;
    const { posts } = this.state;

    // userId === null means it's rendering homepage and not the profile page
    const getPostsPromise = userId === null ? postService.getPostsByPage(1, posts.length) : postService.getUserPosts(userId);

    getPostsPromise.then((response) => {
      const parsedPosts = this.parsePosts(response.posts);

      this.setState({
        posts: parsedPosts,
        editingPostId: null, // the editing dialog should be closed on reload
        hasMoreItems: response.next !== null,
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
    postService.updateUserPost(post).then(() => {
      this.reloadPosts();
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleDelete = (postID) => {
    postService.deleteUserPost(postID).then(() => {
      this.reloadPosts();
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleNewComment = () => {
    // refresh the posts list to render the latest data
    this.reloadPosts();
  }

  render() {
    const { editingPostId, posts, hasMoreItems } = this.state;

    const { postId } = this.props;
    if (postId && posts.length > 0) {
      return (
        <Post
          post={posts[0]}
          previewMode
        />
      );
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
          <Pulse duration={200} key={-1}>
            <div className="postWrapper">
              <EditablePost
                editMode
                originalPost={post}
                defaultPostTitle={post.title}
                defaultPostContent={post.content}
                defaultPostVisibility={post.visibility}
                defaultPostVisibleTo={post.visibleTo}
                defaultPostUnlisted={post.unlisted}
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
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMorePosts}
            hasMore={hasMoreItems}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            {renderedPosts}
          </InfiniteScroll>
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
