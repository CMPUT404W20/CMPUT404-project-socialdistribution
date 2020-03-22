import React, { Component } from "react";
import "../../styles/friends-notices-search/Page.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import NavigationBar from "../NavigationBar";
import SearchItem from "./SearchItem";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      resultsList: [{ id: "001", name: "Username1", type: "Local" }, { id: "002", name: "Username2", type: "Local" }, { id: "003", name: "Username3", type: "Local" }, { id: "004", name: "Username4", type: "Local" }, { id: "005", name: "Username5", type: "Local" }],
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
          type={item.type}
        />,
      );
    });

    return results;
  }

  render() {
    const { resultsList } = this.state;
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
                  &nbsp;results
                </p>
              </div>
              <Fade bottom duration={1000} distance="100px">
                {this.renderSearchResults()}
              </Fade>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default SearchPage;
