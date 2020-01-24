import React from "react";
import {Container, Switch, Typography} from "@material-ui/core";

export default function Settings({isLight, setIsLight}) {
	const onChange = (event) => {
		setIsLight(event.target.checked);
		localStorage.setItem("theme", JSON.stringify(event.target.checked));
	};

	return (
		<Container maxWidth="lg">
			<Typography>Light mode</Typography>
			<Switch checked={isLight} color="primary" onChange={onChange} />
		</Container>
	);
}
