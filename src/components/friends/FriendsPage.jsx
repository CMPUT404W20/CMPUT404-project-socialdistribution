import React, { Component } from "react";
import "../../styles/friends-notices/Page.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import NavigationBar from "../NavigationBar";
import FriendItem from "./FriendItem";
import * as friendsService from "../../services/FriendServices";

class FriendsPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      friendsList: [],
    };
    this.loadFriends();
  }

  loadFriends() {
    const friendsList = [];

    friendsService.getAuthorFriends("http://localhost:8000/author/1").then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        const newFriend = {};
        const friend = response[i];

        newFriend.name = friend.displayName;
        newFriend.id = friend.id;

        friendsList.push(newFriend);
      }

      this.setState({
        friendsList,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleUnfollow(id) {
    const { friendsList } = this.state;
    const filteredList = friendsList.filter((item) => item.id !== id);
    this.setState({ friendsList: filteredList });
  }

  renderFriendItems = () => {
    const { friendsList } = this.state;
    return (
      <Row className="item-list">
        {friendsList.map((item) => (
          <FriendItem
            key={item.id}
            username={item.name}
            id={item.id}
            handleUnfollow={(id) => this.handleUnfollow(id)}
          />
        ))}
      </Row>
    );
  }

  render() {
    const { friendsList } = this.state;
    return (
      <Container fluid className="page-wrapper">
        <Row>
          <Col md={12}>
            <NavigationBar selected="Friends" />
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
    );
  }
}
export default FriendsPage;
