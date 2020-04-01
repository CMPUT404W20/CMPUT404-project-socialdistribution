import React, { Component } from "react";
import "../../styles/post/PrivacySelectorModal.scss";
import Select from "react-select";
import ListGroup from "react-bootstrap/ListGroup";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import * as friendsService from "../../services/FriendService";

class UserSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
      ],
      visibleTo: ["User1", "User2", "User3"],
    };
  }

  componentDidMount() {
    const options = [];

    friendsService.getAllAuthors().then((authors) => {
      for (let i = 0; i < authors.length; i += 1) {
        const o = {
          value: authors[i].id,
          label: authors[i].displayName,
        };

        options.push(o);
      }

      this.setState({
        options,
      });
    });
  }

  render() {
    const { options, visibleTo } = this.state;
    const { onUserRemoval } = this.props;

    return (
      <div className="privacy-people-selector">
        <Select
          options={options}
        />
        <ListGroup>
          {visibleTo.map((username) => (
            <>
              <ListGroup.Item>
                {username}
                <DeleteRoundedIcon
                  className="delete-button"
                  onClick={() => onUserRemoval(username)}
                />
              </ListGroup.Item>
            </>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default UserSelector;
