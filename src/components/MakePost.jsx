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
        <div>
          <div className="form-row-1">
            <b>NEW POST</b>
            <select className="privacy-select">
              <option value="public">&#xf26e; fa-500px</option>
              <option value="lime">Lime</option>
              <option selected value="coconut">
                Coconut
              </option>
              <option value="mango">Mango</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
export default MakePost;
