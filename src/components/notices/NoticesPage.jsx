import React, { Component } from "react";
import "../../styles/friends-notices-search/Page.scss";
import PropTypes from "prop-types";
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
    this.loadRequests();
  }

  handleAccept = (item) => {
    const { currentUser } = this.props;
    friendsService.sendFriendRequest(currentUser, item).then((success) => {
      if (success) {
        this.loadRequests();
      }
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  handleReject = (item) => {
    const { currentUser } = this.props;
    friendsService.rejectFriendRequest(currentUser, item).then((success) => {
      if (success) {
        this.loadRequests();
      }
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }


  loadRequests() {
    const noticesList = [];
    friendsService.getAuthorFriendRequests().then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        const request = response[i];
        noticesList.push(request.fromUser);
      }

      this.setState({
        noticesList, loading: false,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  renderNoticeItems = () => {
    const notices = [];
    const { noticesList } = this.state;

    noticesList.forEach((item) => {
      notices.push(
        <NoticeItem
          key={item.id}
          user={item}
          handleAccept={() => this.handleAccept(item)}
          handleDecline={() => this.handleReject(item)}
        />,
      );
    });

    return notices;
  }

  render() {
    const { noticesList, loading } = this.state;
    const { currentUser } = this.props;
    return (
      !loading && (
      <Container fluid className="page-wrapper">
        <Row>
          <Col md={12}>
            <NavigationBar currentUser={currentUser} key={noticesList.length} />
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

NoticesPage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
};

export default NoticesPage;
