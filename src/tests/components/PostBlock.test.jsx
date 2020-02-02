import React from "react";
import { shallow } from "enzyme";
import PostBlock from "../../components/PostBlock";
import demoImage from "../../staticfiles/demo-img.png";

describe("Post Block Components", () => {
  const content = "test blog content";
  const user = "testuser";
  const postTime = "10 hours ago";
  it("should render correctly", () => {
    const component = shallow(
      <PostBlock
        imageSrc={demoImage}
        username={user}
        postTime={postTime}
        content={content}
      />,
    );
    expect(component).toMatchSnapshot();
  });
});
