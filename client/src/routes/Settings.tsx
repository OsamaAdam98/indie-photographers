import React from "react";
import {Container, Typography, Button} from "@material-ui/core";
import {LightSwitch} from "../components";

interface Props {
	isLight: boolean;
	showBtn: boolean;
	setIsLight: React.Dispatch<React.SetStateAction<boolean>>;
	handleClick: () => void;
}

const Settings: React.FC<Props> = ({
	isLight,
	showBtn,
	setIsLight,
	handleClick
}) => {
	return (
		<Container maxWidth="lg">
			<Typography>Light mode</Typography>
			<LightSwitch isLight={isLight} setIsLight={setIsLight} />
			<Button
				size="large"
				color="primary"
				variant="contained"
				onClick={handleClick}
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
