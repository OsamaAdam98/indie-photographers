import React, {useState} from "react";
import {Button} from "@material-ui/core";

export default function Home() {
	const [pwa, setPwa] = useState();

	window.addEventListener("beforeinstallprompt", (event) => {
		setPwa(event);
		console.log("Event triggered");
	});

	const handleClick = () => {
		pwa.prompt();
		pwa.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				console.log("Used installing APP");
			} else {
				console.log("Prompt dismissed");
			}
			setPwa(null);
		});
	};

	return (
		<div className="container">
			<h1 className="display-4">Hello,</h1>
			<p className="lead">This app is currently in development.</p>
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
}
