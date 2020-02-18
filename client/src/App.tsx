import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import {yellow} from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import React, {lazy, Suspense, useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./css/feed.css";
import "./css/style.css";

const Feed = lazy(() => import("./routes/Feed"));
const Profile = lazy(() => import("./routes/Profile"));
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const Settings = lazy(() => import("./routes/Settings"));
const NotFound = lazy(() => import("./routes/NotFound"));
const MenuAppBar = lazy(() => import("./components/MenuAppBar"));
const SnackAlert = lazy(() => import("./components/SnackAlert"));

const App: React.FC = () => {
	const [isLogged, setIsLogged] = useState(localStorage.getItem("token") ? true : false);

	const [user, setUser] = useState<User>(
		isLogged ? JSON.parse(localStorage.getItem("userInfo") as string) : {admin: false}
	);
	const [openError, setOpenError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [severity, setSeverity] = useState<Severity>(undefined);
	const [pwa, setPwa] = useState<any>(null);
	const [showBtn, setShowBtn] = useState<boolean>(false);
	const [isLight, setIsLight] = useState<boolean>(
		(JSON.parse(localStorage.getItem("theme") as string) as boolean) ? true : false
	);

	const lightTheme = createMuiTheme({
		palette: {
			type: "light",
			primary: {
				main: yellow[700]
			}
		}
	});

	const darkTheme = createMuiTheme({
		palette: {
			type: "dark",
			primary: {
				main: yellow[600]
			}
		}
	});

	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault();
		setPwa(event);
		setShowBtn(true);
	});

	window.addEventListener("appinstalled", (e) => {
		setShowBtn(false);
		setErrorMsg("App installed!");
		setSeverity("success");
		setOpenError(true);
	});

	const handleClick = () => {
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			setErrorMsg(`Please, open the share menu and select "Add to Home Screen"`);
			setSeverity("info");
			setOpenError(true);
		} else {
			if (pwa) {
				pwa.prompt();
				pwa.userChoice.then((choiceResult: {outcome: "accepted" | "refused"}) => {
					if (choiceResult.outcome === "accepted") {
						setErrorMsg("App downloading in the background..");
						setSeverity("info");
						setOpenError(true);
					}
					setPwa(null);
				});
			}
		}
	};

	useEffect(() => {
		const token: string | null = localStorage.getItem("token");
		let userInfo: User = JSON.parse(localStorage.getItem("userInfo") as string);
		if (userInfo && token && !userInfo.admin) {
			setUser(userInfo);
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
						setUser(res.data as User);
					}
					localStorage.setItem(`userInfo`, JSON.stringify(res.data as User));
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
		<ThemeProvider theme={isLight ? lightTheme : darkTheme}>
			<CssBaseline />
			<Router>
				<Route
					path="/"
					render={() => (
						<Suspense fallback={<div />}>
							<MenuAppBar
								isLogged={isLogged}
								setIsLogged={setIsLogged}
								user={user}
								setUser={setUser}
								isLight={isLight}
								setIsLight={setIsLight}
							/>
							<SnackAlert severity={severity} errorMsg={errorMsg} setOpenError={setOpenError} openError={openError} />
						</Suspense>
					)}
				/>
				<Switch>
					<Route
						exact
						path="/"
						render={() => (
							<Suspense fallback={<div />}>
								<Home />
							</Suspense>
						)}
					/>

					<Route
						exact
						path="/profile/:id"
						render={() => (
							<Suspense fallback={<div />}>
								<Profile currentUser={user} />
							</Suspense>
						)}
					/>

					<Route
						exact
						path="/about"
						render={() => (
							<Suspense fallback={<div />}>
								<About />
							</Suspense>
						)}
					/>

					<Route
						exact
						path="/feed"
						render={() => (
							<Suspense fallback={<div />}>
								<Feed isLogged={isLogged} user={user} />
							</Suspense>
						)}
					/>

					<Route
						exact
						path="/settings"
						render={() => (
							<Suspense fallback={<div />}>
								<Settings isLight={isLight} setIsLight={setIsLight} handleClick={handleClick} showBtn={showBtn} />
							</Suspense>
						)}
					/>
					<Route
						render={() => (
							<Suspense fallback={<div />}>
								<NotFound />
							</Suspense>
						)}
					/>
				</Switch>
			</Router>
		</ThemeProvider>
	);
};

export default App;
