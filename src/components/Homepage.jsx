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

  handleEdit = (id) => {
    this.setState({
      editingPostId: id,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  renderPosts() {
    const { editingPostId, posts } = this.state;

    const renderedPosts = [];
    for (let i = 0; i < posts.length; i += 1) {
      const post = posts[i];

      if (post.id !== editingPostId) {
        renderedPosts.push(
          <Row className="postWrapper">
            <Col md={2} />
            <Col md={8}>

              {/* TODO: make this take in the entire post object */}
              <Post
                id={post.id}
                username={post.username}
                postTime={post.postTime}
                imageSrc={post.imageSrc}
                content={post.content}
                onEdit={this.handleEdit}
              />
            </Col>
            <Col md={2} />
          </Row>,
        );
      } else {
        renderedPosts.push(
          <Row className="postWrapper">
            <Col md={2} />
            <Col md={8}>
              <MakePost
                editMode
                defaultPostContent={post.content}
                defaultPostImage={post.imageSrc}
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
            <MakePost />
          </Col>
          <Col md={2} />
        </Row>
        {this.renderPosts()}
      </Container>
    );
  }
}
export default Homepage;
