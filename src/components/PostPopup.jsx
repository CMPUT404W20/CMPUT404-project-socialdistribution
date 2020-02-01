import React, { Component } from "react";
import Row from "react-bootstrap/Row";

class PostPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="post-popup">
        <Row>
          <button className="post-popup-button" type="button">button1</button>
        </Row>
        <Row>
          <button className="post-popup-button" type="button">button1</button>
        </Row>
        <Row>
          <button className="post-popup-button" type="button">button1</button>
        </Row>
      </div>
    );
  }
}

export default PostPopup;
