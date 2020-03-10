import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import MakePost from "./post/MakePost";
import Post from "./post/Post";
import demoImage from "../images/demo-img.png";
import EditPostModal from "./post/EditPostModal";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      editModalVisibility: false,
    };
  }

  toggleEditModalVisibility = () => {
    this.setState((prevState) => ({
      editModalVisibility: !prevState.editModalVisibility,
    }));
  }

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
            onEdit={this.toggleEditModalVisibility}
          />
        </Col>
        <Col md={2} />
      </Row>
    );
  }

  render() {
    const { editModalVisibility } = this.state;

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
        <EditPostModal show={editModalVisibility} onHide={this.toggleEditModalVisibility} />
      </Container>
    );
  }
}
export default Homepage;
