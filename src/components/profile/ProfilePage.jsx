import React from "react";
import "../../styles/profile/ProfilePage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "../NavigationBar";
import ProfileHeader from "./ProfileHeader";
import PostView from "../post/PostView";

function ProfilePage() {
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
            <ProfileHeader />
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

export default ProfilePage;
