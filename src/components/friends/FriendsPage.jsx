import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/friends-notices-search/Page.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import FriendItem from "./FriendItem";
import NavigationBar from "../NavigationBar";
import * as friendsService from "../../services/FriendService";

class FriendsPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      friendsList: [],
      loading: true,
    };
    this.loadFriends();
  }

  handleUnFriend = (item) => {
    friendsService.UnFriend(item).then((success) => {
      if (success) {
        this.loadFriends();
      }
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  loadFriends() {
    const friendsList = [];
    const { user } = this.props;
    friendsService.getAuthorFriends(user.id).then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        const newFriend = {};
        const friend = response[i];

        newFriend.displayName = friend.displayName;
        newFriend.id = friend.id;
        newFriend.host = friend.host;
        friendsList.push(newFriend);
      }

      this.setState({
        friendsList,
        loading: false,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  renderFriendItems = () => {
    const { friendsList } = this.state;
    return (
      <Row>
        {friendsList.map((item) => (
          <FriendItem
            key={item.id}
            username={item.displayName}
            userID={item.id}
            host={item.host}
            handleUnFriend={() => this.handleUnFriend(item)}
          />
        ))}
      </Row>
    );
  }

  render() {
    const { friendsList, loading } = this.state;
    const { user } = this.props;
    return (
      !loading && (
      <Container fluid className="page-wrapper">
        <Row>
          <Col md={12}>
            <NavigationBar user={user} />
          </Col>
        </Row>
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="content-wrapper">
              <div className="title">
                <PeopleAltOutlinedIcon className="icon" />
                <p>Friends</p>
                <p>
                  (
                  {friendsList.length}
                  )
                </p>
              </div>
              {this.renderFriendItems()}
            </div>
          </Col>
        </Row>
      </Container>
      )
    );
  }
}

FriendsPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
};

export default FriendsPage;
