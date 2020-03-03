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
      friendsList: ["F1", "f2", "F3"],
    };
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
              <FriendItem username="username" />
            </div>
          </Col>
          <Col md={2} />
        </Row>
      </Container>
    );
  }
}
export default Homepage;
