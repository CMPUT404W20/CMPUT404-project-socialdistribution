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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      // Todo: query on api
      resultsList: [],
      keyword: queryString.parse(props.location.search).username,
    };
  }

  renderSearchResults = () => {
    const results = [];
    const { resultsList } = this.state;

    resultsList.forEach((item) => {
      results.push(
        <SearchItem
          key={item.id}
          username={item.name}
          userID={item.id}
          host={item.host}
        />,
      );
    });

    return results;
  }

  render() {
    const { resultsList, keyword } = this.state;
    return (
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
    );
  }
}

SearchPage.propTypes = {
  location: PropTypes.objectOf(PropTypes.checkPropTypes()).isRequired,
};

export default SearchPage;
