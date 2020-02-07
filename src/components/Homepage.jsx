import React, { Component } from "react";
import "../styles/homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "./NavBar";
import MakePost from "./MakePost";
import PostBlock from "./post/PostBlock";
import demoImage from "../images/demo-img.png";


class Homepage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <Container fluid className="Homepage">
        <NavBar selected="Home" />
        <Row>
          <Col md={12} className="posts">
            <MakePost />
            <PostBlock
              username="maharsh"
              postTime={new Date()}
              imageSrc={demoImage}
              content="Some content"
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Homepage;
