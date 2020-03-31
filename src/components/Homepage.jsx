/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import EditablePost from "./post/EditablePost";
import PostView from "./post/PostView";
import * as postService from "../services/PostService";
import { userContext } from "../contexts/UserContext";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  handlePostCreation = (post) => {
    // eslint-disable-next-line no-console
    postService.createUserPosts(post).then((response) => {
      if (response.success) {
        this.child.current.loadPosts();
      }
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }


  render() {
    return (
      <Container fluid className="homepage">
        <Row>
          <Col md={12}>
            <userContext.Consumer>
              {(user) => (<NavigationBar user={user} />)}
            </userContext.Consumer>
          </Col>
        </Row>
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="editablePostWrapper">
              <EditablePost
                onSubmit={this.handlePostCreation}
              />
            </div>
            <PostView ref={this.child} />
          </Col>
          <Col md={2} />
        </Row>
      </Container>
    );
  }
}
export default Homepage;
