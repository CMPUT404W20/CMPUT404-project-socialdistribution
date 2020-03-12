/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import MakePost from "./post/MakePost";
import PostView from "./post/PostView";
import * as postService from "../services/PostService";

class Homepage extends Component {
  handlePostCreation = (post) => {
    // eslint-disable-next-line no-console
    postService.createUserPosts(post).then(() => {


    // eslint-disable-next-line no-alert
    // alert("Post Created - Check Console");
    });
  }

  render() {
    return (
      <Container fluid className="homepage">
        <Row>
          <Col md={12}>
            <NavigationBar selected="Home" />
          </Col>
        </Row>
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="makePostWrapper">
              <MakePost
                onSubmit={this.handlePostCreation}
              />
            </div>
            <PostView />
          </Col>
          <Col md={2} />
        </Row>
      </Container>
    );
  }
}
export default Homepage;
