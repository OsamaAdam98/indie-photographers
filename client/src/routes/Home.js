import React from "react";
import {Button, Typography, Container} from "@material-ui/core";

export default function Home(props) {
	const {showBtn, handleClick} = props;

	if (showBtn) {
		return (
			<Container>
				<Typography variant="h1">Hello,</Typography>
				<Typography variant="body1">
					Install the app to browse offline!
				</Typography>
				<Button
					size="large"
					variant="contained"
					color="primary"
					onClick={handleClick}
				>
					Install
				</Button>
			</Container>
		);
	} else {
		return (
			<Container>
				<Typography variant="h1">Hello,</Typography>
				<Typography variant="body1">
					This app is currently in development.
				</Typography>
			</Container>
		);
	}
}
