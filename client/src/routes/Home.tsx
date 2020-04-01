import React from "react";
import * as homeCover from "../assets/home-cover.jpg";
import "../css/home.css";

const Home = () => {
  const versionNumber: string = process.env.HEROKU_RELEASE_VERSION || "vX.x";
  return (
    <div className="home-container">
      <img className="main-img" alt="Home cover" src={homeCover} />
      <h2 className="main-line">
        <span className="highlight">In Development {versionNumber}</span>
      </h2>
    </div>
  );
};

export default Home;
