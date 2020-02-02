import React from "react";
import Container from "react-bootstrap/Container";
import PostBlock from "./PostBlock";
import demoImage from "../staticfiles/demo-img.png";

function App() {
  var content =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  return (
    <Container fluid className="app">
      <PostBlock
        imageSrc={demoImage}
        username={"testuser"}
        postTime={"10 hours ago"}
        content={content}
      />
    </Container>
  );
}

export default App;
