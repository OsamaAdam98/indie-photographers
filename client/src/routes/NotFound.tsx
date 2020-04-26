import React from "react";
import { Link } from "react-router-dom";
import "../scss/four-o-four.scss";

const NotFound: React.FC = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
          <h2>Page not found</h2>
        </div>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
