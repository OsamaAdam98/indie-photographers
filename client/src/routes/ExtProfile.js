import React, {useState, useEffect} from "react";
import axios from "axios";

export default function ExtProfile(props) {
	const [username, setUsername] = useState("");
	const [pic, setPic] = useState("");

	useEffect(() => {
		axios.get(`/api/users/profile/${props.match.params.id}`).then((res) => {
			const {username, profilePicture} = res.data;
			setUsername(username);
			setPic(profilePicture);
		});
	}, [props.match.params.id]);

	return (
		<div>
			<div className="container-fluid">
				<div>
					<img
						src={pic}
						alt="avatar"
						style={{width: "10rem", height: "10rem", borderRadius: "50%"}}
					/>
				</div>
				{username}
				<br />
			</div>
		</div>
	);
}
