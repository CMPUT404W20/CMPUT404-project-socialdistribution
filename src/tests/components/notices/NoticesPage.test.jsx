import React from "react";
import { shallow } from "enzyme";
import NoticesPage from "../../../components/notices/NoticesPage";

describe("Notices Page Component", () => {
  it("should render correctly", () => {
    const component = shallow(<NoticesPage />);
    expect(component).toMatchSnapshot();
  });
});
