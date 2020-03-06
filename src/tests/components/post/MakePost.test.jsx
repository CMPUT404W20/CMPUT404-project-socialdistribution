import React from "react";
import { shallow } from "enzyme";
import TextareaAutosize from "react-textarea-autosize";
import MakePost from "../../../components/post/MakePost";

describe("Post box Component", () => {
  it("should render correctly", () => {
    const component = shallow(<MakePost />);
    expect(component).toMatchSnapshot();
  });

  it("should have a text area", () => {
    const component = shallow(<MakePost />);
    expect(component.find(TextareaAutosize)).toHaveLength(1);
  });

  it("should show the modal after clicking on image icon", () => {
    const component = shallow(<MakePost />);
    const { uploadModalVisibility } = component.state();
    expect(uploadModalVisibility).toBe(false);
    setTimeout(() => {
      component.find(".image-icon").simulate("click");

      jest.runOnlyPendingTimers();
      component.update();
      expect(uploadModalVisibility).toBe(true);
    }, 500);
  });
});
