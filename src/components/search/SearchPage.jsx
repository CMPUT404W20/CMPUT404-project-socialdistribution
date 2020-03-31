import React, { Component } from "react";
import "../../styles/friends-notices-search/Page.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";
import queryString from "query-string";
import NavigationBar from "../NavigationBar";
import SearchItem from "./SearchItem";
import * as friendsService from "../../services/FriendService";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      resultsList: [],
      keyword: queryString.parse(props.location.search).username,
      loading: true,
    };
  }

  componentDidMount() {
    const { keyword } = this.state;
    friendsService.searchAuthors(keyword).then((response) => {
      this.setState({
        resultsList: response,
        loading: false,
      });
    }).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
  }

  renderSearchResults = () => {
    const results = [];
    const { resultsList } = this.state;
    const { user } = this.props;
    resultsList.forEach((item) => {
      results.push(
        <SearchItem
          key={item.id}
          user={item}
          currentHost={user.host}
        />,
      );
    });

    return results;
  }

  render() {
    const { resultsList, keyword, loading } = this.state;
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
                <p>
                  Showing&nbsp;
                  {resultsList.length}
                  &nbsp;results for &quot;
                  {keyword}
                  &quot;
                </p>
              </div>
              <Fade bottom duration={1000} distance="100px">
                <div>
                  {this.renderSearchResults()}
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

SearchPage.propTypes = {
  location: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
};

export default SearchPage;
