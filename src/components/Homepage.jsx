/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import MakePost from "./post/MakePost";
import Post from "./post/Post";
import * as postService from "../services/PostService";

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      editingPostId: null,
    };
    this.loadPosts();
  }

  // eslint-disable-next-line class-methods-use-this
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

  handlePostCreation = (post) => {
    // eslint-disable-next-line no-console
    console.log(post);
    // eslint-disable-next-line no-alert
    alert("Post Created - Check Console");
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

  // eslint-disable-next-line class-methods-use-this
  renderPosts() {
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

  render() {
    return (
      <Container fluid className="homepage">
        <Row>
          <Col md={12}>
            <NavigationBar selected="Home" />
          </Col>
        </Row>
        <Row className="makePostWrapper">
          <Col md={2} />
          <Col md={8}>
            <MakePost
              onSubmit={this.handlePostCreation}
            />
          </Col>
          <Col md={2} />
        </Row>
        {this.renderPosts()}
      </Container>
    );
  }
}
export default Homepage;
