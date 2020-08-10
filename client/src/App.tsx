import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { yellow } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { appReducer } from "./components";
import SnackAlert from "./components/SnackAlert";
import UserContext, { DispatchContext } from "./context/AppContext";
import "./scss/style.scss";
import * as serviceWorker from "./serviceWorker";

const Feed = lazy(() => import("./routes/Feed"));
const Profile = lazy(() => import("./routes/Profile"));
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const Settings = lazy(() => import("./routes/Settings"));
const NotFound = lazy(() => import("./routes/NotFound"));
const MenuAppBar = lazy(() => import("./components/MenuAppBar"));

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(appReducer, {
    isLogged: localStorage.getItem("token") ? true : false,
    user: JSON.parse(localStorage.getItem("userInfo") as string)
      ? JSON.parse(localStorage.getItem("userInfo") as string)
      : { admin: false },
    openError: false,
    errorMsg: "",
    severity: undefined,
    pwa: null,
    showBtn: false,
    isLight: (JSON.parse(localStorage.getItem("theme") as string) as boolean)
      ? true
      : false,
  });

  const lightTheme = createMuiTheme({
    palette: {
      type: "light",
      primary: {
        main: "#098203",
      },
      background: {
        default: "#f6f6f6",
      },
    },
  });

  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: yellow[600],
      },
    },
  });

  const appInstalledListener = (event: any) => {
    dispatch({ type: "clearPWA" });
    dispatch({
      type: "showSnackAlert",
      errorMsg: "App Installed!",
      severity: "success",
    });
  };

  const beforeInstallListener = (event: any) => {
    event.preventDefault();
    dispatch({ type: "setPWA", pwa: event });
  };

  useEffect(() => {
    serviceWorker.register({
      onSuccess: () => {
        dispatch({
          type: "showSnackAlert",
          severity: "success",
          errorMsg: "App installed, feel free to browse offline!",
        });
      },
      onUpdate: (reg) => {
        reg.waiting?.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      },
      onOffline: () => {
        dispatch({
          type: "showSnackAlert",
          severity: "info",
          errorMsg: "You're now offline, new content cannot be loaded.",
        });
      },
    });

    document.documentElement.setAttribute(
      "data-theme",
      (JSON.parse(localStorage.getItem("theme") as string) as boolean)
        ? "light"
        : "dark"
    );

    window.addEventListener("beforeinstallprompt", beforeInstallListener);
    window.addEventListener("appinstalled", appInstalledListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallListener);
      window.removeEventListener("appinstalled", appInstalledListener);
    };
  }, []);

  const handleClick = () => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      dispatch({
        type: "showSnackAlert",
        errorMsg: `Please, open the share menu and select "Add to Home Screen"`,
        severity: "info",
      });
    } else {
      if (state.pwa) {
        state.pwa.prompt();
        state.pwa.userChoice.then(
          (choiceResult: { outcome: "accepted" | "refused" }) => {
            if (choiceResult.outcome === "accepted") {
              dispatch({
                type: "showSnackAlert",
                errorMsg: "App downloading in the background..",
                severity: "info",
              });
            }
            dispatch({ type: "clearPWA" });
          }
        );
      }
    }
  };

  return (
    <ThemeProvider theme={state.isLight ? lightTheme : darkTheme}>
      <CssBaseline />
      <UserContext.Provider
        value={{
          isLogged: state.isLogged,
          user: state.user,
          isLight: state.isLight,
        }}
      >
        <DispatchContext.Provider value={{ dispatch }}>
          <Router>
            <Route
              render={() => (
                <Suspense fallback={<div />}>
                  <MenuAppBar />
                  <SnackAlert
                    errorMsg={state.errorMsg!}
                    openError={state.openError!}
                    severity={state.severity!}
                    dispatch={dispatch}
                  />
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
                    <Profile />
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
                    <Feed isLogged={state.isLogged} user={state.user} />
                  </Suspense>
                )}
              />

              <Route
                exact
                path="/settings"
                render={() => (
                  <Suspense fallback={<div />}>
                    <Settings
                      handleClick={handleClick}
                      showBtn={state.showBtn}
                    />
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
            <Link to="/settings" className="hidden">
              settings
            </Link>
            <Link to="/feed" className="hidden">
              feed
            </Link>
            <Link to="/about" className="hidden">
              about
            </Link>
          </Router>
        </DispatchContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default App;
