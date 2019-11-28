import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";

import Home from "./routes/Home";
import Marketplace from "./routes/Marketplace";
import Profile from "./routes/Profile";

function App() {
	return (
		<Router>
			<div className="container-full">
				<NavBar />
				<Route exact path="/" component={Home} />
				<Route path="/marketplace" component={Marketplace} />
				<Route path="/profile" component={Profile} />
			</div>
		</Router>
	);
}

export default App;
