import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {yellow} from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import React, {lazy, Suspense, useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {
	Home,
	MenuAppBar,
	NotFound,
	PostSkeleton,
	ProfileSkeleton,
	Settings,
	SnackAlert,
	useWindowDimensions
} from "./components";
import "./css/feed.css";
import "./css/style.css";

const Feed = lazy(() => import("./routes/Feed"));
const Profile = lazy(() => import("./routes/Profile"));

const App: React.FC = () => {
	const [isLogged, setIsLogged] = useState(localStorage.getItem("token") ? true : false);

	const {width} = useWindowDimensions();

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

	const theme: customTheme = {
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
		<MuiThemeProvider theme={isLight ? createMuiTheme(theme.lightTheme) : createMuiTheme(theme.darkTheme)}>
			<CssBaseline />
			<Router>
				<MenuAppBar
					isLogged={isLogged}
					setIsLogged={setIsLogged}
					user={user}
					setUser={setUser}
					isLight={isLight}
					setIsLight={setIsLight}
				/>
				<Switch>
					<Route exact path="/" render={() => <Home />} />
					<Route
						path="/profile/:id"
						render={() => (
							<Suspense fallback={<ProfileSkeleton />}>
								<Profile currentUser={user} />
							</Suspense>
						)}
					/>
					<Route
						exact
						path="/feed"
						render={() => (
							<Suspense
								fallback={
									<div className="feed-container">
										<div className="feed-post-block">
											<PostSkeleton />
										</div>
									</div>
								}
							>
								<Feed isLogged={isLogged} user={user} />
							</Suspense>
						)}
					/>
					<Route
						exact
						path="/settings"
						render={() => (
							<Settings isLight={isLight} setIsLight={setIsLight} handleClick={handleClick} showBtn={showBtn} />
						)}
					/>
					<Route component={NotFound} />
				</Switch>
			</Router>
			<SnackAlert severity={severity} errorMsg={errorMsg} setOpenError={setOpenError} openError={openError} />
			<div
				style={{
					height: 48,
					display: width < 500 ? "" : "none"
				}}
			/>
		</MuiThemeProvider>
	);
};

export default App;
