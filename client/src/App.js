import React, {useState, useEffect} from "react";
import axios from "axios";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "./css/style.css";
import {
	Home,
	Profile,
	Feed,
	MenuAppBar,
	SnackAlert,
	BottomBar,
	useWindowDimensions
} from "./components";

function App() {
	const [isLogged, setIsLogged] = useState(
		localStorage.getItem("token") ? true : false
	);

	const {width} = useWindowDimensions();

	const [user, setUser] = useState({admin: false});
	const [openError, setOpenError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [severity, setSeverity] = useState("");
	const [pwa, setPwa] = useState();
	const [showBtn, setShowBtn] = useState(false);

	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault();
		setPwa(event);
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			!(
				window.matchMedia("(display-mode: standalone)").matches ||
				window.navigator.standalone === true
			)
		) {
			setShowBtn(true);
		} else {
			setShowBtn(false);
		}
	});

	window.addEventListener("appinstalled", (e) => {
		setShowBtn(false);
		setErrorMsg("App installed!");
		setSeverity("success");
		setOpenError(true);
	});

	const handleClick = () => {
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			setErrorMsg(
				`Please, open the share menu and select "Add to Home Screen"`
			);
			setSeverity("info");
			setOpenError(true);
		} else {
			pwa.prompt();
			pwa.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					setErrorMsg("App downloading in the background..");
					setSeverity("info");
					setOpenError(true);
				}
				setPwa(null);
			});
		}
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
					path="/profile/:id"
					render={(props) => <Profile {...props} user={user} />}
				/>
				<Route
					path="/feed"
					render={(props) => (
						<Feed {...props} isLogged={isLogged} user={user} />
					)}
				/>
				<SnackAlert
					severity={severity}
					errorMsg={errorMsg}
					setOpenError={setOpenError}
					openError={openError}
				/>
				{width < 500 && (
					<BottomBar user={user} showBtn={showBtn} handleClick={handleClick} />
				)}
			</>
		</Router>
	);
}

export default App;
