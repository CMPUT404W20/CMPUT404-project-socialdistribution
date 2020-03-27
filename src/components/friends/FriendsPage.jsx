import React, { Component } from "react";
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

  loadFriends() {
    const friendsList = [];
    const userID = localStorage.getItem("userID");
    friendsService.getAuthorFriends(userID).then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        const newFriend = {};
        const friend = response[i];

        newFriend.name = friend.displayName;
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

  handleUnfollow(userID) {
    const { friendsList } = this.state;
    const filteredList = friendsList.filter((item) => item.id !== userID);
    this.setState({ friendsList: filteredList });
  }

  renderFriendItems = () => {
    const { friendsList } = this.state;
    return (
      <Row>
        {friendsList.map((item) => (
          <FriendItem
            key={item.id}
            username={item.name}
            userID={item.id}
            host={item.host}
            handleUnfollow={(id) => this.handleUnfollow(id)}
          />
        ))}
      </Row>
    );
  }

  render() {
    const { friendsList, loading } = this.state;
    return (
      !loading && (
      <Container fluid className="page-wrapper">
        <Row>
          <Col md={12}>
            <NavigationBar />
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
export default FriendsPage;
