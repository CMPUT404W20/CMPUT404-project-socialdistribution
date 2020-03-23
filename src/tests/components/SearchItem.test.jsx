import React from "react";
import { shallow } from "enzyme";
import SearchItem from "../../components/search/SearchItem";

describe("Search Item Component", () => {
  it("should render correctly", () => {
    const component = shallow(<SearchItem userID="" username="" type="" />);
    expect(component).toMatchSnapshot();
  });
});
