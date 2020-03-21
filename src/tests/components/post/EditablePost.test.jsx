import React from "react";
import { shallow } from "enzyme";
import EditablePost from "../../../components/post/EditablePost";

describe("Post box Component", () => {
  it("should render correctly", () => {
    const component = shallow(
      <EditablePost
        onSubmit={() => {}}
      />,
    );
    expect(component).toMatchSnapshot();
  });
});
