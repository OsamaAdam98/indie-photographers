import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";

import Home from "./routes/Home";
import Marketplace from "./routes/Marketplace";
import Profile from "./routes/Profile";

function App() {
	const [isLogged, setIsLogged] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		if (localStorage.getItem("token")) setIsLogged(true);
	}, []);

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
					<Profile user={user} setUser={setUser} />
				</Route>
			</div>
		</Router>
	);
}

export default App;
