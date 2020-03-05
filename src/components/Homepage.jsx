import React, { Component } from "react";
import "../styles/Homepage.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "./NavigationBar";
import MakePost from "./post/MakePost";
import Post from "./post/Post";
import demoImage from "../images/demo-img.png";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  // eslint-disable-next-line class-methods-use-this
  renderPosts() {
    // eslint-disable-next-line quotes
    const mdContent = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

1. Bullet 1
2. Bullet 2

[Google Link](https://www.google.com)

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Some logo")

Inline \`code\` 

\`\`\`
var s = "some code";
alert(s);
\`\`\`

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> Blockquote

---

Normal Text
    `;

    return (
      <Row className="postWrapper">
        <Col md={2} />
        <Col md={8}>
          <Post
            username="username"
            postTime={new Date()}
            imageSrc={demoImage}
            content={mdContent}
          />
        </Col>
        <Col md={2} />
      </Row>
    );
  }

  render() {
    return (
      <Container fluid className="homepage">
        <Row>
          <Col md={12}>
            <NavigationBar selected="Home" />
          </Col>
        </Row>
        <Row className="makePostWrapper">
          <Col md={2} />
          <Col md={8}>
            <MakePost />
          </Col>
          <Col md={2} />
        </Row>
        {this.renderPosts()}
      </Container>
    );
  }
}
export default Homepage;
