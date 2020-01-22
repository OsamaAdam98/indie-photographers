import React from "react";
import {useHistory} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";

export default function PhotoPreview(props) {
	const {pic, username, show, setShow} = props;
	const history = useHistory();

	const handleShow = () => {
		setShow(true);
		window.location.hash = "photo-preview";
	};

	const handleClose = () => {
		setShow(false);
		if (props.location.hash === "#photo-preview") history.goBack();
	};

	const imagePreview = (
		<img
			src={pic}
			alt={`by, ${username}`}
			onClick={handleShow}
			style={{
				objectFit: "cover",
				objectPosition: "50% 50%",
				width: "100%",
				maxHeight: 250
			}}
		/>
	);

	const fullImage = (
		<img
			src={pic}
			alt={`by, ${username}`}
			style={{
				objectFit: "scale-down",
				objectPosition: "50% 50%",
				maxWidth: "100%",
				maxHeight: "100%"
			}}
		/>
	);

	return (
		<>
			{imagePreview}
			<Dialog open={show} onClose={handleClose}>
				{fullImage}
			</Dialog>
		</>
	);
}
