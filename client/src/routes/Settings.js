import React from "react";
import {Container, Typography} from "@material-ui/core";
import {LightSwitch} from "../components";

export default function Settings({isLight, setIsLight}) {
	return (
		<Container maxWidth="lg">
			<Typography>Light mode</Typography>
			<LightSwitch isLight={isLight} setIsLight={setIsLight} />
		</Container>
	);
}
