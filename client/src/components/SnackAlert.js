import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackAlert(props) {
	const {severity, openError, setOpenError, errorMsg} = props;

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenError(false);
	};

	return (
		<>
			<Snackbar
				open={openError}
				autoHideDuration={6000}
				onClose={handleClose}
				onClick={handleClose}
				style={{
					position: "fixed",
					bottom: "70px"
				}}
			>
				<Alert severity={severity}>{errorMsg}</Alert>
			</Snackbar>
		</>
	);
}
