// NOT USED

import React from "react";
import {Link} from "react-router-dom";

export default function FeedPost(props) {
	const {msg} = props.feedPost.post;
	const {username, profilePicture, id} = props.feedPost.user;

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
				<h5 className="mt-0">
					<Link to={`/profile/${id}`}>{username}</Link>
				</h5>

				<p>{msg}</p>
			</div>
		</div>
	);
}
