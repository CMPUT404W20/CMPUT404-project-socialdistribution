// https://alligator.io/react/manage-user-login-react-context/
import React from "react";

const userContext = React.createContext({ currentUser: {} }); // Create a context object

export {
  // eslint-disable-next-line import/prefer-default-export
  userContext, // Export it so it can be used by other Components
};
