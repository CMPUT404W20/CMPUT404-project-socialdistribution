import React from "react";
import { shallow } from "enzyme";
import FriendsPage from "../../../components/friends/FriendsPage";

describe("Friends Page Component", () => {
  it("should render correctly", () => {
    const component = shallow(<FriendsPage currentUser={{
      id: "", displayName: "", host: "", github: "", url: "",
    }}
    />);
    expect(component).toMatchSnapshot();
  });
});
