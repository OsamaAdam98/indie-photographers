import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";

const theme = createMuiTheme({
	palette: {
		type: "dark"
	}
});

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<CssBaseline />
		<App />
	</MuiThemeProvider>,
	document.getElementById("root")
);
serviceWorker.register();
