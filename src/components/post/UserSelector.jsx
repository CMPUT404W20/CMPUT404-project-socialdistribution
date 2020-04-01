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
      allAuthors: [],
    };
  }

  componentDidMount() {
    const allAuthors = [];

    friendsService.getAllAuthors().then((authors) => {
      for (let i = 0; i < authors.length; i += 1) {
        const author = {
          value: authors[i].id,
          label: authors[i].displayName,
        };

        allAuthors.push(author);
      }

      this.setState({
        allAuthors,
      });
    });
  }

  render() {
    const { allAuthors } = this.state;
    const { onUserRemoval, visibleTo } = this.props;

    return (
      <div className="privacy-people-selector">
        <Select
          options={allAuthors}
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
