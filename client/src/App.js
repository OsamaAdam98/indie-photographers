import React, {useState, useEffect} from "react";
import axios from "axios";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";

import Home from "./routes/Home";
import Marketplace from "./routes/Marketplace";
import Profile from "./routes/Profile";

function App() {
	const [isLogged, setIsLogged] = useState(true);
	const [user, setUser] = useState({});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (isLogged) {
			axios
				.get("/api/auth/user", {
					headers: {
						"x-auth-token": `${token}`
					}
				})
				.then((res) => {
					setUser(res.data);
					setIsLogged(true);
				})
				.catch((err) => {
					if (err) {
						localStorage.removeItem("token");
						setIsLogged(false);
					}
				});
		}
	}, [isLogged]);

	return (
		<Router>
			<div className="container-full">
				<NavBar
					isLogged={isLogged}
					setIsLogged={setIsLogged}
					user={user}
					setUser={setUser}
				/>
				<Route exact path="/" component={Home} />
				<Route path="/marketplace" component={Marketplace} />
				<Route path="/profile">
					<Profile user={user} setIsLogged={setIsLogged} />
				</Route>
			</div>
		</Router>
	);
}

export default App;
