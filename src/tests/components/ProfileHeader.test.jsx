import React from "react";
import { shallow } from "enzyme";
import ProfileHeader from "../../components/ProfileHeader";

describe("Navigation bar Component", () => {
  it("should render correctly", () => {
    const component = shallow(<ProfileHeader />);
    expect(component).toMatchSnapshot();
  });
});
