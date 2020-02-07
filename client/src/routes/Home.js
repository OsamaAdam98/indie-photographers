import React from "react";
import "../css/home.css";
import homeCover from "../assets/home-cover.jpg";

export default function Home() {
	return (
		<div className="home-container">
			<img className="main-img" alt="Home cover" src={homeCover} />
			<h2 className="main-line">
				<span className="highlight">In development V0.1.4a</span>
			</h2>
		</div>
	);
}
