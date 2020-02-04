import React from "react";
import PostBlock from "./post/PostBlock";
import demoImage from "../images/image-1.jpeg";

function App() {
  return (
    // <Login />
    <PostBlock
      username="test"
      content="test"
      postTime="10 hours ago"
      imageSrc={demoImage}
    />
  );
}

export default App;
