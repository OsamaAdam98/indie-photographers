import React from "react";
import * as homeCover from "../assets/home-cover.jpg";
import "../scss/home.scss";

const Home = () => {
  return (
    <div className="home-container">
      <img className="main-img" alt="Home cover" src={homeCover} />
      <h2 className="main-line">
        <span className="highlight">In Development V0.7 (GraphQL)</span>
      </h2>
    </div>
  );
};

export default Home;
