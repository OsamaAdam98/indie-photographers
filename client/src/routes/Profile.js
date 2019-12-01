import React, {useState, useEffect} from "react";
import Loadingpage from "../components/Loadingpage";

export default function Profile(props) {
	const {user} = props;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!user) setIsLoading(true);
		setIsLoading(false);
	}, [user]);

	if (isLoading) return <Loadingpage />;
	return (
		<div className="container-fluid">
			{user.username}
			<br />
			{user.email}
			<br />
			<button
				className="btn btn-danger"
				onClick={() => {
					localStorage.removeItem("token");
					window.location = "/";
				}}
			>
				Logout
			</button>
		</div>
	);
}
