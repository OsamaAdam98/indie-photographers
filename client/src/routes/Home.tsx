import React from "react";
import "../css/home.css";
import * as homeCover from "../assets/home-cover.jpg";

const Home = () => {
	return (
		<div className="home-container">
			<img className="main-img" alt="Home cover" src={homeCover} />
			<h2 className="main-line">
				<span className="highlight">In development V0.2</span>
			</h2>
		</div>
	);
};

export default Home;
