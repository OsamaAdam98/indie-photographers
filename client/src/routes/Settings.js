import React from "react";
import {Container, Typography, Button} from "@material-ui/core";
import {LightSwitch} from "../components";

export default function Settings({isLight, setIsLight, handleClick, showBtn}) {
	return (
		<Container maxWidth="lg">
			<Typography>Light mode</Typography>
			<LightSwitch isLight={isLight} setIsLight={setIsLight} />
			<Button
				size="large"
				color="primary"
				variant="contained"
				onClick={handleClick}
				disabled={!showBtn}
			>
				Install
			</Button>
		</Container>
	);
}
