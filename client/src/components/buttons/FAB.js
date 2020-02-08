import React from "react";
import {withRouter} from "react-router-dom";
import {Fab, Zoom, makeStyles, useTheme} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: 500,
		position: "relative",
		minHeight: 200
	},
	customFab: {
		margin: 0,
		top: "auto",
		right: 20,
		bottom: 70,
		left: "auto",
		position: "fixed"
	},
	"@media (min-width: 31.25rem)": {
		customFab: {
			margin: 0,
			top: "auto",
			right: 20,
			bottom: 20,
			left: "auto",
			position: "fixed"
		}
	}
}));

function FAB(props) {
	const {offline} = props;
	const classes = useStyles();
	const theme = useTheme();

	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen
	};

	const fab = {
		color: "primary",
		className: classes.customFab,
		icon: props.icon,
		label: "Edit"
	};

	return (
		<Zoom
			key={fab.color}
			in={props.location.pathname === props.currentLocation}
			timeout={transitionDuration}
			style={{
				display: offline ? "none" : "",
				transitionDelay: `${
					props.location.pathname === props.currentLocation
						? transitionDuration.exit
						: 0
				}ms`
			}}
			unmountOnExit
		>
			<Fab
				aria-label={fab.label}
				className={fab.className}
				color={fab.color}
				onClick={props.handleClick}
			>
				{fab.icon}
			</Fab>
		</Zoom>
	);
}

export default withRouter(FAB);
