import {Snackbar} from "@material-ui/core";
import {AlertProps} from "@material-ui/lab/Alert";
import React, {Suspense} from "react";
import {actions} from "../reducers/appReducer";

const MuiAlert = React.lazy(() => import("@material-ui/lab/Alert"));

const Alert = (props: AlertProps) => {
	return (
		<Suspense fallback={<div />}>
			<MuiAlert elevation={6} variant="filled" {...props} />
		</Suspense>
	);
};

interface Props {
	severity: Severity;
	openError: boolean;
	errorMsg: string;
	dispatch: React.Dispatch<actions>;
}

const SnackAlert: React.FC<Props> = ({severity, openError, errorMsg, dispatch}) => {
	const handleClose = (
		event: React.SyntheticEvent<any, Event> | React.MouseEvent<HTMLDivElement, MouseEvent>,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch({type: "hideSnackAlert"});
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
};

export default SnackAlert;
