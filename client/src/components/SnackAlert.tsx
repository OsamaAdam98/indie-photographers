import {Snackbar} from "@material-ui/core";
import {AlertProps} from "@material-ui/lab/Alert";
import React, {Suspense} from "react";

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
	setOpenError: React.Dispatch<React.SetStateAction<boolean>>;
	errorMsg: string;
}

const SnackAlert: React.FC<Props> = (props) => {
	const {severity, openError, setOpenError, errorMsg} = props;

	const handleClose = (
		event: React.SyntheticEvent<any, Event> | React.MouseEvent<HTMLDivElement, MouseEvent>,
		reason?: string
	) => {
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
};

export default SnackAlert;
