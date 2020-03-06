import React, { Component } from "react";
import "../../styles/friends/FriendsPage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import NavigationBar from "../NavigationBar";
import NoticeItem from "./NoticeItem";

class NoticesPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      noticesList: [{ id: "001", name: "Username1", type: "Local" }, { id: "002", name: "Username2", type: "Local" }, { id: "003", name: "Username3", type: "Local" }, { id: "004", name: "Username4", type: "Local" }, { id: "005", name: "Username5", type: "Local" }],
    };
  }

  handleRemoveNotice(id) {
    const { noticesList } = this.state;
    const filteredList = noticesList.filter((item) => item.id !== id);
    this.setState({ noticesList: filteredList });
  }

  handleAccept(id) {
    // accept the request
    this.handleRemoveNotice(id);
  }

  renderNoticeItems = () => {
    const { noticesList } = this.state;
    return (
      <Row className="item-list">
        {noticesList.map((item) => (
          <NoticeItem
            key={item.id}
            username={item.name}
            id={item.id}
            type={item.type}
            handleAccept={(id) => this.handleAccept(id)}
            handleDecline={(id) => this.handleRemoveNotice(id)}
          />
        ))}
      </Row>
    );
  }

  render() {
    const { noticesList } = this.state;
    return (
      <Container fluid className="page-wrapper">
        <Row>
          <Col md={12}>
            <NavigationBar selected="Notifications" />
          </Col>
        </Row>
        <Row>
          <Col md={2} />
          <Col md={8}>
            <div className="content-wrapper">
              <div className="title">
                <NotificationsNoneOutlinedIcon className="icon" />
                <p>Notifications</p>
                <p>
                  (
                  {noticesList.length}
                  )
                </p>
              </div>
              {this.renderNoticeItems()}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default NoticesPage;
