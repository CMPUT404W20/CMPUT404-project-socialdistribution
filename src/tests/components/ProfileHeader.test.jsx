import React from "react";
import { shallow } from "enzyme";
import ProfileHeader from "../../components/profile/ProfileHeader";

describe("Navigation bar Component", () => {
  it("should render correctly", () => {
    const component = shallow(<ProfileHeader isFriends isFollowing isSelf host="" username="aaa" />);
    expect(component).toMatchSnapshot();
  });
});
