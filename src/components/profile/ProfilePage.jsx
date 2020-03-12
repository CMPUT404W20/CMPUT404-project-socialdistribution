import React, { Component } from "react";
import "../../styles/profile/ProfilePage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import NavigationBar from "../NavigationBar";
import ProfileHeader from "./ProfileHeader";
import PostView from "../post/PostView";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      username: location.state.username,
      userID: location.state.userID,
      currentUserID: localStorage.getItem("userID"),
    };
  }

  render() {
    const { username, userID, currentUserID } = this.state;
    const isSelf = (currentUserID === userID);
    // TODO: const isFriends, isFollowing
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
                // need to improve the logic
                isSelf={isSelf}
                isFriends={false}
                isFollowing={false}
                remote={false}
                username={username}
              />
            </div>
            <PostView
            // TODO: change this to the current user's full id
              userId={localStorage.getItem("userID")}
            />
          </Col>
          <Col md={2} />
        </Row>
      </Container>
    );
  }
}

ProfilePage.propTypes = {
  location: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
};

export default ProfilePage;
