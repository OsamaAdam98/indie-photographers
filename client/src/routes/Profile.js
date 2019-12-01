import React, {useState, useEffect} from "react";
import Loadingpage from "../components/Loadingpage";

export default function Profile(props) {
	const {user, setIsLogged} = props;
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
					setIsLogged(false);
					window.location = "/";
				}}
			>
				Logout
			</button>
		</div>
	);
}
