import {Button, Container, Typography, makeStyles} from "@material-ui/core";
import React from "react";
import {LightSwitch} from "../components";

const useStyles = makeStyles(() => ({
	btnStyle: {
		"@media all and (display-mode: standalone)": {
			display: "none"
		}
	}
}));

interface Props {
	isLight: boolean;
	showBtn: boolean;
	setIsLight: React.Dispatch<React.SetStateAction<boolean>>;
	handleClick: () => void;
}

const Settings: React.FC<Props> = ({isLight, showBtn, setIsLight, handleClick}) => {
	const classes = useStyles();

	return (
		<Container maxWidth="lg">
			<Typography>Light mode</Typography>
			<LightSwitch isLight={isLight} setIsLight={setIsLight} />
			<Button
				size="large"
				color="primary"
				variant="contained"
				onClick={handleClick}
				className={classes.btnStyle}
				style={{
					display: showBtn ? "" : "none"
				}}
			>
				Install
			</Button>
		</Container>
	);
};

export default Settings;
