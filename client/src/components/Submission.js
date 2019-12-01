import React from "react";

export default function Submission(props) {
	const {username, msg} = props.sub;
	return (
		<div className="media mb-3">
			<img
				src="https://i.imgur.com/AgN6DIR.jpg"
				className="align-self-start mr-3"
				alt="user-profile"
				style={{height: "3rem", width: "3rem"}}
			/>
			<div className="media-body">
				<h5 className="mt-0">{username}</h5>
				<p>{msg}</p>
			</div>
		</div>
	);
}
