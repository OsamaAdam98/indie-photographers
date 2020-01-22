import React, {useState, useEffect} from "react";
import axios from "axios";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./routes/Home";
import Marketplace from "./routes/Marketplace";
import Profile from "./routes/Profile";
import Feed from "./routes/Feed";
import MenuAppBar from "./components/MenuAppBar";

function App() {
	const [isLogged, setIsLogged] = useState(
		localStorage.getItem("token") ? true : false
	);
	const [user, setUser] = useState({admin: false});

	const [pwa, setPwa] = useState();
	const [showBtn, setShowBtn] = useState(
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) &&
			!(
				window.matchMedia("(display-mode: standalone)").matches ||
				window.navigator.standalone === true
			)
	);

	window.addEventListener("beforeinstallprompt", (event) => {
		setPwa(event);
		console.log("Event triggered");
	});

	window.addEventListener("appinstalled", (e) => {
		setShowBtn(false);
	});

	const handleClick = () => {
		pwa.prompt();
		pwa.userChoice.then((choiceResult) => {
			setPwa(null);
		});
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo && token) {
			setUser(JSON.parse(userInfo));
			setIsLogged(true);
		}
		if (isLogged) {
			axios
				.get("/api/auth/user", {
					headers: {
						"x-auth-token": `${token}`
					}
				})
				.then((res) => {
					if (!userInfo || !token) {
						setUser(res.data);
					}
					localStorage.setItem(`userInfo`, JSON.stringify(res.data));
					setIsLogged(true);
				})
				.catch((err) => {
					if (err) {
						setIsLogged(false);
					}
				});
		} else {
			localStorage.removeItem("token");
			localStorage.removeItem("userInfo");
		}
	}, [isLogged]);

	return (
		<Router>
			<>
				<MenuAppBar
					isLogged={isLogged}
					setIsLogged={setIsLogged}
					user={user}
					setUser={setUser}
					showBtn={showBtn}
					handleClick={handleClick}
				/>
				<Route
					exact
					path="/"
					render={(props) => (
						<Home {...props} showBtn={showBtn} handleClick={handleClick} />
					)}
				/>
				<Route
					path="/marketplace"
					render={(props) => (
						<Marketplace {...props} isLogged={isLogged} user={user} />
					)}
				/>
				<Route
					path="/profile/:id"
					render={(props) => <Profile {...props} user={user} />}
				/>
				<Route
					path="/feed"
					render={(props) => (
						<Feed {...props} isLogged={isLogged} user={user} />
					)}
				/>
			</>
		</Router>
	);
}

export default App;
