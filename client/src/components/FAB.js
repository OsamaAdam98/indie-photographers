import React from "react";
import {withRouter} from "react-router-dom";
import {Fab, Zoom, makeStyles, useTheme} from "@material-ui/core";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: 500,
		position: "relative",
		minHeight: 200
	},
	fabGreen: {
		color: theme.palette.common.white,
		backgroundColor: green[500],
		"&:hover": {
			backgroundColor: green[600]
		}
	},
	customFab: {
		margin: 0,
		top: "auto",
		right: 20,
		bottom: 20,
		left: "auto",
		position: "fixed"
	}
}));

function FAB(props) {
	const classes = useStyles();
	const theme = useTheme();

	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen
	};

	const fab = {
		color: "secondary",
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
