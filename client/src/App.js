import React, {useState, useEffect, lazy, Suspense} from "react";
import axios from "axios";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./css/style.css";
import "./css/feed.css";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core";
import {yellow} from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
	Home,
	MenuAppBar,
	SnackAlert,
	useWindowDimensions,
	Settings,
	NotFound,
	PostSkeleton,
	ProfileSkeleton
} from "./components";

const Feed = lazy(() => import("./routes/Feed"));
const Profile = lazy(() => import("./routes/Profile"));

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
	const [isLight, setIsLight] = useState(
		JSON.parse(localStorage.getItem("theme")) ? true : false
	);

	const theme = {
		darkTheme: {
			palette: {
				type: "dark",
				primary: {
					main: yellow[600]
				}
			}
		},
		lightTheme: {
			palette: {
				type: "light",
				primary: {
					main: yellow[700]
				}
			}
		}
	};

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
		<MuiThemeProvider
			theme={
				isLight
					? createMuiTheme(theme.lightTheme)
					: createMuiTheme(theme.darkTheme)
			}
		>
			<CssBaseline />
			<Router>
				<MenuAppBar
					isLogged={isLogged}
					setIsLogged={setIsLogged}
					user={user}
					setUser={setUser}
					showBtn={showBtn}
					handleClick={handleClick}
					isLight={isLight}
					setIsLight={setIsLight}
				/>
				<Switch>
					<Route exact path="/" render={(props) => <Home {...props} />} />
					<Route
						path="/profile/:id"
						render={(props) => (
							<Suspense fallback={<ProfileSkeleton />}>
								<Profile {...props} currentUser={user} />
							</Suspense>
						)}
					/>
					<Route
						exact
						path="/feed"
						render={(props) => (
							<Suspense
								fallback={
									<div className="feed-container">
										<div className="feed-post-block">
											<PostSkeleton />
										</div>
									</div>
								}
							>
								<Feed {...props} isLogged={isLogged} user={user} />
							</Suspense>
						)}
					/>
					<Route
						exact
						path="/settings"
						render={(props) => (
							<Settings {...props} isLight={isLight} setIsLight={setIsLight} />
						)}
					/>
					<Route component={NotFound} />
				</Switch>
			</Router>
			<SnackAlert
				severity={severity}
				errorMsg={errorMsg}
				setOpenError={setOpenError}
				openError={openError}
			/>
			<div
				style={{
					height: 48,
					display: width < 500 ? "" : "none"
				}}
			/>
		</MuiThemeProvider>
	);
}

export default App;
