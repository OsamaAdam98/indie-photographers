import React from "react";
import {Link} from "react-router-dom";

export default function LogoutButton(props) {
	const {setIsLogged, className} = props;

	return (
		<>
			<Link
				to="/"
				className={`${className}`}
				onClick={() => {
					setIsLogged(false);
				}}
			>
				Logout
			</Link>
		</>
	);
}
