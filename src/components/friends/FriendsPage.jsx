import React, { Component } from "react";
import "../../styles/friends/FriendsPage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import NavigationBar from "../NavigationBar";
import FriendItem from "./FriendItem";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      friendsList: [{ id: "001", name: "Username1" }, { id: "002", name: "Username2" }, { id: "003", name: "Username3" }, { id: "004", name: "Username4" }, { id: "005", name: "Username5" }],
    };
  }

  handleUnfollow(id) {
    const { friendsList } = this.state;
    const filteredList = friendsList.filter((item) => item.id !== id);
    this.setState({ friendsList: filteredList });
  }

  renderFriendItems = () => {
    const { friendsList } = this.state;
    return (
      <Row className="friends-list">
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
      <Container fluid className="friendsPage">
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
export default Homepage;
