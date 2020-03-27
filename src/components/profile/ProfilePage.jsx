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
import * as auth from "../../services/AuthenticationService";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      username: location.state.username,
      userID: location.state.userID,
      host: location.state.host,
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
          this.setState({ isFriends: true, loading: false });
        } else {
          this.setState({ loading: false });
        }
      }).catch((error) => {
      // eslint-disable-next-line no-alert
        alert(error);
      });
    } else {
      auth.getCurrentUser()
        .then(((response) => {
          this.setState({ github: response.data.github, loading: false });
        }));
    }
  }

  renderHeader = () => {
    const {
      username, isFollowing, isFriends, userID, currentUserID, loading, github, host,
    } = this.state;
    const isSelf = (userID === currentUserID);
    return (
      !loading && (
      <ProfileHeader
        isSelf={isSelf}
        isFriends={isFriends}
        isFollowing={isFollowing}
        host={host}
        username={username}
        github={github}
      />
      )
    );
  }

  render() {
    const { userID } = this.state;
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
              userId={userID}
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
