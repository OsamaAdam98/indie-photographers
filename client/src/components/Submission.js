import React from "react";
import {Link} from "react-router-dom";

export default function Submission(props) {
	const {msg} = props.sub.submission;
	const {username, profilePicture, id} = props.sub.user;

	return (
		<div className="media mb-3">
			<Link to={`/profile/${id}`}>
			<img
				src={profilePicture}
				className="align-self-start mr-3"
				alt="Avatar"
				style={{height: "3rem", width: "3rem", borderRadius: "50%"}}
			/>
			</Link>
			<div className="media-body">
				<h5 className="mt-0">{username}</h5>
				<p>{msg}</p>
			</div>
		</div>
	);
}
