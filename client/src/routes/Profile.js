import React, {useState, useEffect} from "react";
import axios from "axios";
import Loadingpage from "../components/Loadingpage";

export default function Profile(props) {
	const {user, setUser} = props;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");

		setIsLoading(true);

		axios
			.get("/api/auth/user", {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				setUser(res.data);
				setIsLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

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
