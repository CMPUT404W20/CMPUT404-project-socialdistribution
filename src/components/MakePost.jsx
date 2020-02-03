import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/makePost.scss";
import Form from "react-bootstrap/Form";

class MakePost extends Component {
  render() {
    return (
      <div className="makePost">
        <div className="block">
          <div className="form-row-1">
            <b>NEW POST</b>
            <select className="privacy-select">
              <option selected value="public">
                Anyone
              </option>
              <option value="another author">Specific author</option>
              <option value="friends">Friends</option>
              <option value="mutual friends">Mutual friends</option>
              <option value="local friends">Local friends</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="row-2-input">
            <textarea placeholder="What's on your mind?"></textarea>
          </div>
        </div>
      </div>
    );
  }
}
export default MakePost;
