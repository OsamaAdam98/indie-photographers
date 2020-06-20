import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const Client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authentication: token ? token : "",
      },
    });
  },
});

ReactDOM.render(
  <ApolloProvider client={Client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
