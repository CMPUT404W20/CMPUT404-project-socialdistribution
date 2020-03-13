import React, { Component } from "react";
import "../../styles/profile/ProfilePage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import NavigationBar from "../NavigationBar";
import ProfileHeader from "./ProfileHeader";
import PostView from "../post/PostView";
import * as friendsService from "../../services/FriendService";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      username: location.state.username,
      userID: location.state.userID,
      currentUserID: localStorage.getItem("userID"),
      isFollowing: false,
      isFriends: false,
      isSelf: (location.state.userID === localStorage.getItem("userID")),
      loading: true,
    };
  }

  componentDidMount() {
    const { userID, currentUserID, isSelf } = this.state;
    if (!isSelf) {
      friendsService.checkFriendStatus(currentUserID, userID).then((response) => {
        if (response) {
          friendsService.checkFriendStatus(userID, currentUserID).then((response2) => {
            if (response2) {
              this.setState({ isFriends: true, isFollowing: true, loading: false });
            } else {
              this.setState({ isFollowing: true, loading: false });
            }
          });
        }
      }).catch((error) => {
      // eslint-disable-next-line no-alert
        alert(error);
      });
    } else {
      this.setState({ loading: false });
    }
  }

  renderHeader = () => {
    const {
      username, isFollowing, isFriends, userID, currentUserID, loading,
    } = this.state;
    const isSelf = (userID === currentUserID);
    return (
      !loading && (
      <ProfileHeader
        isSelf={isSelf}
        isFriends={isFriends}
        isFollowing={isFollowing}
        remote={false}
        username={username}
      />
      )
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
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="profileHeaderWrapper">
              {this.renderHeader()}
            </div>
            <PostView
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
