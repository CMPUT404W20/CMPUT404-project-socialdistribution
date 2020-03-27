import React, { Component } from "react";
import "../../styles/friends-notices-search/Page.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import Fade from "react-reveal/Fade";
import NavigationBar from "../NavigationBar";
import NoticeItem from "./NoticeItem";
import * as friendsService from "../../services/FriendService";

class NoticesPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      noticesList: [],
      loading: true,
      // render the page after loading otherwise the count will first flash as 0 then
      // show the actual count
    };
  }

  componentDidMount() {
    const noticesList = [];
    friendsService.getAuthorFriendRequests().then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        const newRequest = {};
        const request = response[i];

        newRequest.name = request.fromUser.displayName;
        newRequest.id = request.fromUser.id;
        newRequest.host = request.fromUser.host;

        noticesList.push(newRequest);
      }

      this.setState({
        noticesList, loading: false,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleRemoveNotice(id) {
    const { noticesList } = this.state;
    const filteredList = noticesList.filter((item) => item.id !== id);
    this.setState({ noticesList: filteredList });
  }

  handleAccept(id) {
    // TODO: accept the request
    this.handleRemoveNotice(id);
  }

  renderNoticeItems = () => {
    const notices = [];
    const { noticesList } = this.state;

    noticesList.forEach((item) => {
      notices.push(
        <NoticeItem
          key={item.id}
          username={item.name}
          userID={item.id}
          host={item.host}
          handleAccept={(id) => this.handleAccept(id)}
          handleDecline={(id) => this.handleRemoveNotice(id)}
        />,
      );
    });

    return notices;
  }

  render() {
    const { noticesList, loading } = this.state;
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
                <NotificationsNoneOutlinedIcon className="icon" />
                <p>Notifications</p>
                <p>
                  (
                  {noticesList.length}
                  )
                </p>
              </div>
              <Fade bottom duration={1000} distance="100px">
                {/* this div is required otherwise the page won't render correctly */}
                <div className="notice-view" key={-1}>
                  {this.renderNoticeItems()}
                </div>
              </Fade>
            </div>
          </Col>
        </Row>
      </Container>
      )
    );
  }
}
export default NoticesPage;
