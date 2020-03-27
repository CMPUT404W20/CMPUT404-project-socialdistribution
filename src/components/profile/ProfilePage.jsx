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
    const { location, user } = this.props;
    this.state = {
      isFollowing: false,
      isFriends: false,
      isSelf: (location.state.user.id === user.id),
      loading: true,
    };
  }

  componentDidMount() {
    const { isSelf } = this.state;
    const { location, user } = this.props;
    const currentUserID = user.id;
    const userID = location.state.user.id;
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
      this.setState({ loading: false });
    }
  }

  renderHeader = () => {
    const {
      isFollowing, isFriends, loading, isSelf,
    } = this.state;
    const { location, user } = this.props;
    return (
      !loading && (
      <ProfileHeader
        isSelf={isSelf}
        isFriends={isFriends}
        isFollowing={isFollowing}
        host={location.state.user.host}
        username={location.state.user.displayName}
        github={user.github}
      />
      )
    );
  }

  render() {
    const { user, location } = this.props;
    return (
      <Container fluid className="profilePage">
        <Row>
          <Col md={12}>
            <NavigationBar user={user} />
          </Col>
        </Row>
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="profileHeaderWrapper">
              {this.renderHeader()}
            </div>
            <PostView
              userId={location.state.user.id}
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
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
};

export default ProfilePage;
