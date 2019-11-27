import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./routes/Home";
import Marketplace from "./routes/Marketplace";
import NavBar from "./components/NavBar";

function App() {
	return (
		<Router>
			<div className="container-full">
				<NavBar />
				<Route exact path="/" component={Home} />
				<Route path="/marketplace" component={Marketplace} />
			</div>
		</Router>
	);
}

export default App;
