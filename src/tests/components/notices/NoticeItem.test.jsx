import React from "react";
import { shallow } from "enzyme";
import NoticeItem from "../../../components/notices/NoticeItem";

describe("Notice Item Component", () => {
  it("should render correctly", () => {
    const component = shallow(<NoticeItem id="" username="" type="" handleDecline={() => {}} handleAccept={() => {}} />);
    expect(component).toMatchSnapshot();
  });
});
