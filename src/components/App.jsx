import React from "react";
import {
  BrowserRouter, Route
} from "react-router-dom";
import Login from "./Login";
import AuthRouter from "./AuthRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthRouter />
    </BrowserRouter>
  );
}

export default App;
