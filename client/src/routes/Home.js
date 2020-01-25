import React from "react";
import {Button, Typography, Container, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
	"@media (max-width: 500px)": {
		btn: {
			width: "100%"
		}
	},
	btn: {
		width: 230
	}
});

export default function Home(props) {
	const {showBtn, handleClick} = props;
	const classes = useStyles();

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
					className={classes.btn}
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
