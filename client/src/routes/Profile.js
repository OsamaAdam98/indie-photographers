import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Loadingpage from "../components/Loadingpage";
import LogoutButton from "../components/LogoutButton";

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
			<div>
				<img
					src={user.profilePicture}
					alt="avatar"
					style={{width: "10rem", height: "10rem", borderRadius: "50%"}}
				/>
			</div>
			{user.username}
			<br />
			{user.email}
			<br />
			<LogoutButton setIsLogged={setIsLogged} className="btn btn-danger" />
		</div>
	);
}
