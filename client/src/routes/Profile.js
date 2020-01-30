import React, {useState, useEffect} from "react";
import axios from "axios";
import {Paper, Typography} from "@material-ui/core";
import "../css/profile.css";
import {PostMedia} from "../components/index";

export default function Profile(props) {
	const [user, setUser] = useState("");

	useEffect(() => {
		axios
			.get(`/api/users/${props.match.params.id}`)
			.then((res) => {
				const {data} = res;
				console.log(data);
				setUser(data);
			})
			.catch((err) => console.log(err));
	}, [props.match.params.id]);

	return (
		<div className="container">
			<Paper className="main-block">
				<div className="cover-photo" />
				<img className="profile-photo" src={user.profilePicture} />
				<div className="tagline">
					<Typography variant="h5">{user.username}</Typography>
					<Typography style={{fontStyle: "italic"}}>
						<span className="highlight">title</span>
					</Typography>
				</div>
				<div className="main-info">
					<Typography>
						Irure culpa sint tempor Lorem Lorem eu eu consequat in elit. Laborum
						id magna mollit pariatur. Incididunt velit mollit sit aliqua duis
						esse nisi velit esse ad occaecat voluptate aliqua esse. Adipisicing
						pariatur sint consequat ea et pariatur sint nisi anim.
					</Typography>
				</div>
			</Paper>
			<Paper className="details-block"></Paper>
			<div className="post-block" />
		</div>
	);
}
