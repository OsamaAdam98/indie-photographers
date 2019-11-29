import React, {useState, useEffect} from "react";
import axios from "axios";

export default function Profile() {
	const [user, setUser] = useState({});

	useEffect(() => {
		const token = localStorage.getItem("token");

		axios
			.get("/api/auth/user", {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => console.log(err));
	}, []);

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
