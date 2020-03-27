import React from "react";
import { shallow } from "enzyme";
import FriendsPage from "../../../components/friends/FriendsPage";

describe("Friends Page Component", () => {
  it("should render correctly", () => {
    const component = shallow(<FriendsPage user={{ id: "" }} />);
    expect(component).toMatchSnapshot();
  });
});
