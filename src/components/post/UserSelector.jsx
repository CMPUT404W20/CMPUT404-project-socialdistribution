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
      searchValue: null,
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

  handleSelectChange = (user) => {
    this.setState({
      searchValue: null,
    });

    const { onUserAdd } = this.props;

    onUserAdd(user.label);
  }

  handleInputChange = (newValue) => {
    this.setState({
      searchValue: newValue,
    });

    return newValue;
  };

  render() {
    const { allAuthors, searchValue } = this.state;
    const { onUserRemoval, visibleTo } = this.props;

    return (
      <div className="privacy-people-selector">
        <Select
          options={allAuthors}
          value={searchValue}
          onChange={this.handleSelectChange}
          onInputChange={this.handleInputChange}
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
