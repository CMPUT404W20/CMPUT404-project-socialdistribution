import React from "react";
import { shallow } from "enzyme";
import PostBlock from "../../components/PostBlock";
import PostDropDown from "../../components/PostDropDown";
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

  it("dropdown should be rendered after clicking the more button", () => {
    const component = shallow(
      <PostBlock
        imageSrc={demoImage}
        username={user}
        postTime={postTime}
        content={content}
      />,
    );
    const moreButton = component.find("#post-more-button");
    moreButton.simulate("click");

    expect(moreButton.find(PostDropDown).length).toBe(1);
  });
});
