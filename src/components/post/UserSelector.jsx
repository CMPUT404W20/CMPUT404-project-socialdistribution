import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../styles/post/UserSelector.scss";
import Select from "react-select";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import * as friendsService from "../../services/FriendService";

class UserSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allAuthors: [],
      searchValue: null,
      loading: true,
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
        loading: false,
      });
    });
  }

  handleSelectChange = (user) => {
    this.setState({
      searchValue: null,
    });

    const { onUserAdd } = this.props;

    onUserAdd(user.value);
  }

  handleInputChange = (newValue) => {
    this.setState({
      searchValue: newValue,
    });

    return newValue;
  }

  getUsername = (id) => {
    const { allAuthors } = this.state;
    const username = allAuthors.find((author) => author.value === id).label;

    return username;
  }

  render() {
    const { allAuthors, searchValue, loading } = this.state;
    const { onUserRemoval, visibleTo, show } = this.props;

    if (!show) {
      return <div />;
    }
    if (loading) {
      return (
        <div className="privacy-loading-circle">
          <Spinner size="sm" animation="border" variant="primary" />
        </div>
      );
    }
    return (
      <div className="user-selector-wrapper">
        <Select
          className="user-selector-input"
          options={allAuthors}
          value={searchValue}
          onChange={this.handleSelectChange}
          onInputChange={this.handleInputChange}
          placeholder="Search author by username"
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary25: "#438bff49",
              primary: "#5c9cf5",
            },
          })}
        />
        <ListGroup>
          {visibleTo.map((username) => (
            <>
              <ListGroup.Item>
                {this.getUsername(username)}
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

UserSelector.propTypes = {
  onUserAdd: PropTypes.func.isRequired,
  onUserRemoval: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  visibleTo: PropTypes.array.isRequired,
  // use a show prop instead of conditional rendering so we can pre-load the
  // list of authors so no loading is required after - and no unmounting
  show: PropTypes.bool,
};

UserSelector.defaultProps = {
  show: false,
};


export default UserSelector;
