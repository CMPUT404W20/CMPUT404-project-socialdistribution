import React, { Component } from "react";
import "../styles/ProfilePage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import Post from "./post/Post";
import demoImage from "../images/demo-img.png";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  // eslint-disable-next-line class-methods-use-this
  renderPosts() {
    return (
      <Row className="postWrapper">
        <Col md={2} />
        <Col md={8}>
          <Post
            username="username"
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
      <Container fluid className="profilePage">
        <Row>
          <Col md={12}>
            <NavigationBar />
          </Col>
        </Row>
        {/* <Row className="makePostWrapper">
          <Col md={2} />
          <Col md={8}>
            <MakePost />
          </Col>
          <Col md={2} />
        </Row> */}
        {this.renderPosts()}
      </Container>
    );
  }
}
export default ProfilePage;
