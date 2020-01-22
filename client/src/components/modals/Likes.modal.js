import React, {useState} from "react";
import axios from "axios";
import {Link, useHistory} from "react-router-dom";
import {Button, Avatar, Divider} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import LikesSkeleton from "../LikesSkeleton";
import useWindowDimensions from "../utilities/WindowDimensions";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SnackAlert from "../SnackAlert";
import {IconButton} from "@material-ui/core";

export default function Likes(props) {
	const {post, likes, show, setShow} = props;
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMsg, setErrorMsg] = useState("");
	const [openError, setOpenError] = useState(false);
	const {width} = useWindowDimensions();

	const history = useHistory();

	// useEffect(() => {
	// 	if (post && show) {
	// 		history.push("/feed/");
	// 		setIsLoading(true);
	// 		axios
	// 			.get(`/api/feed/likes/${post._id}`)
	// 			.then((res) => {
	// 				setUsers(res.data.map((data) => data.user));
	// 				localStorage.setItem(`${post._id}`, JSON.stringify(res.data));
	// 				setIsLoading(false);
	// 				setOpenError(false);
	// 				setErrorMsg("");
	// 			})
	// 			.catch((err) => {
	// 				console.log(err);
	// 				let cachedData = JSON.parse(localStorage.getItem(`${post._id}`));
	// 				if (cachedData) {
	// 					setErrorMsg("Can't connect, fetching from cache.");
	// 					setOpenError(true);
	// 					setUsers(cachedData.map((data) => data.user));
	// 					setIsLoading(false);
	// 				} else {
	// 					setErrorMsg("Can't connect to the internet!");
	// 					setOpenError(true);
	// 				}
	// 			});
	// 	}
	// 	return setUsers([]);
	// }, [post, show]);

	const entering = () => {
		window.location.hash = "likes";
		setIsLoading(true);
		axios
			.get(`/api/feed/likes/${post._id}`)
			.then((res) => {
				setUsers(res.data.map((data) => data.user));
				localStorage.setItem(`${post._id}`, JSON.stringify(res.data));
				setIsLoading(false);
				setOpenError(false);
				setErrorMsg("");
			})
			.catch((err) => {
				console.log(err);
				let cachedData = JSON.parse(localStorage.getItem(`${post._id}`));
				if (cachedData) {
					setErrorMsg("Can't connect, fetching from cache.");
					setOpenError(true);
					setUsers(cachedData.map((data) => data.user));
					setIsLoading(false);
				} else {
					setErrorMsg("Can't connect to the internet!");
					setOpenError(true);
				}
			});
	};
	const exiting = () => {
		setUsers([]);
	};

	const handleClose = () => {
		setShow(false);
		if (props.location.hash === "#likes") history.goBack();
	};

	const handleShow = () => {
		setShow(true);
	};

	const likedUsers = users.map((user) => {
		return (
			<Link to={`/profile/${user._id}`} key={user._id}>
				<ListItem alignItems="center">
					<ListItemAvatar>
						<Avatar alt={user.username} src={user.profilePicture} />
					</ListItemAvatar>
					<ListItemText
						primary={user.username}
						secondary={user.admin ? `Admin` : `User`}
					/>
				</ListItem>
			</Link>
		);
	});

	return (
		<>
			<Button
				onClick={handleShow}
				style={{
					marginLeft: "1rem",
					marginTop: "1rem",
					display: likes ? "" : `none`
				}}
			>
				{likes === 1 ? `${likes} like` : `${likes} likes`}
			</Button>
			<Dialog
				open={show}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				maxWidth="xs"
				fullWidth={true}
				fullScreen={width < 500}
				onEntering={entering}
				onExiting={exiting}
				scroll="paper"
			>
				<DialogTitle
					id="form-dialog-title"
					style={{height: width > 500 ? "1rem" : "3.5rem"}}
				>
					<IconButton
						style={{
							marginRight: "1rem",
							display: width < 500 ? `` : `none`
						}}
						onClick={handleClose}
					>
						<ArrowBackIosIcon />
					</IconButton>
					Liked by
				</DialogTitle>
				<DialogContent>
					<List>
						<Divider />
						{isLoading ? <LikesSkeleton likes={likes} /> : likedUsers}
					</List>
				</DialogContent>
			</Dialog>
			<SnackAlert
				severity="warning"
				openError={openError}
				setOpenError={setOpenError}
				errorMsg={errorMsg}
			/>
		</>
	);
}
