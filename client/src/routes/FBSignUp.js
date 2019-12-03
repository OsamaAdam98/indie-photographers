import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";

export default function FBSignUp(props) {
	const {user, setUser, setIsLogged} = props;

	const history = useHistory();

	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const passwordChange = (event) => setPassword(event.target.value);
	const handleSubmit = (event) => {
		if (!password) {
			setErrorMsg("Please enter a password");
			event.preventDefault();
		} else {
			const newUser = {
				...user,
				password
			};
			axios
				.post("/api/users", newUser)
				.then((res) => {
					const {token, user} = res.data;
					if (token) {
						localStorage.setItem("token", token);
						setIsLogged(true);
					}
					if (user) {
						setUser(user);
					}
					history.push("/");
				})
				.catch((err) => console.log(err));
		}
		event.preventDefault();
	};

	const signUpError = errorMsg ? (
		<div className="alert alert-danger" role="alert">
			{errorMsg}
		</div>
	) : null;

	return (
		<div className="container-fluid">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email-input">Email</label>
					<input
						type="email"
						className="form-control disabled"
						id="email-input"
						value={user.email}
						disabled={true}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password-input">Password</label>
					<input
						type="password"
						className="form-control"
						id="password-input"
						value={password}
						onChange={passwordChange}
					/>
				</div>
				{signUpError}
				<button
					type="submit"
					className="btn btn-primary"
					onClick={handleSubmit}
				>
					Sign up
				</button>
			</form>
		</div>
	);
}
