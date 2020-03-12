import React, { Component } from "react";
import "../../styles/profile/ProfilePage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "../NavigationBar";
import ProfileHeader from "./ProfileHeader";
import PostView from "../post/PostView";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const isSelf = this.props.location.state.isSelf || false;
    const isFriends = this.props.location.state.isFriends || false;
    const isFollowing = this.props.location.state.isFollowing || false;
    const username = isSelf ? localStorage.getItem("username") : this.props.location.state.username;
    return (
      <Container fluid className="profilePage">
        <Row>
          <Col md={12}>
            <NavigationBar />
          </Col>
        </Row>
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="profileHeaderWrapper">
              <ProfileHeader
                isSelf={isSelf}
                isFriends={isFriends}
                isFollowing={isFollowing}
                remote={false}
                username={username}
              />
            </div>
            <PostView
            // TODO: change this to the current user's full id
              userId="https://cmput404-socialdistribution.herokuapp.com/author/1"
            />
          </Col>
          <Col md={2} />
        </Row>
      </Container>
    );
  }
}

export default ProfilePage;
