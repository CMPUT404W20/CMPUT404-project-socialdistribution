import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import MakePost from "./MakePost";
import PostBlock from "./post/PostBlock";
import demoImage from "../images/demo-img.png";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  renderPosts = () => {
    return (
      <Row className="post">
        <Col md={2} />
        <Col md={8}>
          <PostBlock
            className="testing"
            username="maharsh"
            postTime={new Date()}
            imageSrc={demoImage}
            content="Some content"
          />
        </Col>
        <Col md={2} />
      </Row>
    );
  }

  render() {
    return (
      <Container fluid className="homepage">
        <Row>
          <Col md={12}>
            <NavigationBar selected="Home" />
          </Col>
        </Row>
        <Row className="createPostDialog">
          <Col md={2} />
          <Col md={8}>
            <MakePost />
          </Col>
          <Col md={2} />
        </Row>
        {this.renderPosts()}
        {this.renderPosts()}
      </Container>
    );
  }
}
export default Homepage;
