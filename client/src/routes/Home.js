import React from "react";
import "../css/home.css";
import homeCover from "../assets/home-cover.jpg";

export default function Home() {
	return (
		<div className="container">
			<img className="main-img" alt="Home cover" src={homeCover} />
			<h1 className="main-line">
				<span className="highlight">In development</span>
			</h1>
		</div>
	);
}
