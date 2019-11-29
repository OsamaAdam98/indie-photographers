import React from "react";

export default function Loadingpage() {
	return (
		<div className="justify-content-center d-flex">
			<div
				className="spinner-border"
				style={{width: "100px", height: "100px", marginTop: "100px"}}
				role="status"
			>
				<span className="sr-only">Loading..</span>
			</div>
		</div>
	);
}
