/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import "../../styles/post/PostView.scss";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MakePost from "./MakePost";
import Post from "./Post";
import * as postService from "../../services/PostService";
// import PropTypes from "prop-types";

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
    const posts = [];

    postService.getPosts().then((response) => {
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
          <Row className="postWrapper" key={post.id}>
            <Col md={2} />
            <Col md={8}>
              <Post
                post={post}
                onEdit={this.handleEditToggle}
              />
            </Col>
            <Col md={2} />
          </Row>,
        );
      } else {
        renderedPosts.push(
          <Row className="postWrapper" key={-1}>
            <Col md={2} />
            <Col md={8}>
              <MakePost
                editMode
                originalPost={post}
                defaultPostContent={post.content}
                defaultPostImage={post.imageSrc}
                onSubmit={this.handlePostUpdate}
                // set the current post being edited to null -> close the edit dialog
                onDiscard={() => this.handleEditToggle(null)}
              />
            </Col>
            <Col md={2} />
          </Row>,
        );
      }
    }

    return renderedPosts;
  }
}


PostView.propTypes = {
};

PostView.defaultProps = {
};

export default PostView;
