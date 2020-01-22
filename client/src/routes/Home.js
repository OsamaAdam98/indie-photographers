import React from "react";
import {Button} from "@material-ui/core";

export default function Home(props) {
	const {showBtn, handleClick} = props;

	if (showBtn) {
		return (
			<div className="container">
				<h1 className="display-4">Hello,</h1>
				<p className="lead">Install the app to browse offline!</p>
				<Button
					size="large"
					variant="contained"
					color="primary"
					onClick={handleClick}
				>
					Install
				</Button>
			</div>
		);
	} else {
		return (
			<div className="container">
				<h1 className="display-4">Hello,</h1>
				<p className="lead">This app is currently in development.</p>
			</div>
		);
	}
}
