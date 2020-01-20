import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Button, Avatar} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

export default function Likes(props) {
	const {post, likes} = props;
	const [show, setShow] = useState(false);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (post && show) {
			let cachedData = JSON.parse(localStorage.getItem(`${post._id}`));
			if (cachedData) {
				setUsers(cachedData.map((data) => data.user));
			}
			axios
				.get(`/api/feed/likes/${post._id}`)
				.then((res) => {
					if (!cachedData) {
						setUsers(res.data.map((data) => data.user));
						localStorage.setItem(`${post._id}`, JSON.stringify(res.data));
					}
				})
				.catch((err) => console.log(err));
		}
		return setUsers([]);
	}, [post, show]);

	const handleClose = () => {
		setShow(false);
	};

	const handleShow = () => {
		setShow(true);
	};

	const likedUsers = users.map((user) => {
		return (
			<Link to={`/profile/${user._id}`} key={user._id}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar alt={user.username} src={user.profilePicture} />
					</ListItemAvatar>
					<ListItemText primary={user.username} />
				</ListItem>
			</Link>
		);
	});

	return (
		<>
			<Button
				onClick={handleShow}
				style={{marginLeft: "1rem", display: likes ? null : `none`}}
			>
				{likes === 1 ? `${likes} like` : `${likes} likes`}
			</Button>
			<Dialog
				open={show}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Liked by</DialogTitle>
				<DialogContent>
					<List>{likedUsers}</List>
				</DialogContent>
			</Dialog>
		</>
	);
}
