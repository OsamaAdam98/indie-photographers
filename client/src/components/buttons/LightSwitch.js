import React from "react";
import {Switch} from "@material-ui/core";

export default function LightSwitch({isLight, setIsLight}) {
	const onChange = (event) => {
		setIsLight(event.target.checked);
		localStorage.setItem("theme", JSON.stringify(event.target.checked));
	};

	return (
		<div>
			<Switch checked={isLight} color="primary" onChange={onChange} />
		</div>
	);
}
