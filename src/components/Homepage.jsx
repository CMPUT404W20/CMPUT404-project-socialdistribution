/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import MakePost from "./post/MakePost";
import Post from "./post/Post";
import demoImage from "../images/demo-img.png";

class Homepage extends Component {
  constructor(props) {
    super(props);

    const posts = this.loadPosts();
    this.state = {
      posts,
      editingPostId: null,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  loadPosts() {
    const posts = [];
    for (let i = 0; i < 4; i += 1) {
      posts.push({
        id: i,
        username: "username",
        postTime: new Date(),
        imageSrc: demoImage,
        content: "Some Content",
      });
    }

    return posts;
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
