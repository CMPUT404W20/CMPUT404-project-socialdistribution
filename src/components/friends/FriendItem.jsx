import React, { Component } from "react";
import "../../styles/friends/FriendItem.scss";

class FriendItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  render() {
    const { username } = this.props;
    return (
      <div className="friend-item-wrapper">
        <p>{username}</p>
      </div>
    );
  }
}
export default FriendItem;
