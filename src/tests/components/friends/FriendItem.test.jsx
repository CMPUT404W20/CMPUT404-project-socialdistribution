import React from "react";
import { shallow } from "enzyme";
import FriendItem from "../../../components/friends/FriendItem";

describe("FriendItem Component", () => {
  it("should render correctly", () => {
    const component = shallow(<FriendItem id="" username="" handleUnfollow={() => {}} />);
    expect(component).toMatchSnapshot();
  });
});
