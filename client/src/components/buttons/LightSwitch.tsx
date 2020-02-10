import React from "react";
import {Switch} from "@material-ui/core";

interface Props {
	isLight: boolean;
	setIsLight: React.Dispatch<React.SetStateAction<boolean>>;
}

const LightSwitch: React.FC<Props> = ({isLight, setIsLight}) => {
	const onChange = (event: any) => {
		setIsLight(event.target.checked);
		localStorage.setItem("theme", JSON.stringify(event.target.checked));
	};

	return (
		<div>
			<Switch checked={isLight} color="primary" onChange={onChange} />
		</div>
	);
};

export default LightSwitch;
