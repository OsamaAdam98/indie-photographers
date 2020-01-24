import React, {useState} from "react";
import axios from "axios";
import {Link, useHistory} from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SnackAlert from "../SnackAlert";
import {
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Dialog,
	DialogContent,
	DialogTitle,
	Button,
	Avatar,
	Divider
} from "@material-ui/core";
import {useWindowDimensions, LikesSkeleton} from "..";

export default function Likes(props) {
	const {post, likes, show, setShow} = props;
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMsg, setErrorMsg] = useState("");
	const [openError, setOpenError] = useState(false);
	const [selfShow, setSelfShow] = useState(false);
	const {width} = useWindowDimensions();

	const history = useHistory();

	const entering = () => {
		handleShow();
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
		setSelfShow(false);
		if (props.location.hash === "#likes") history.goBack();
	};

	const handleShow = () => {
		setSelfShow(true);
		setShow(true);
		window.location.hash = "likes";
	};

	const likedUsers = users.map((user) => {
		if (user) {
			return (
				<Link to={`/profile/${user._id}`} key={user._id} className="text-link">
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
		} else {
			return (
				<ListItem alignItems="center" key="">
					<ListItemAvatar>
						<Avatar alt="Deleted User" src="" />
					</ListItemAvatar>
					<ListItemText primary="Deleted User" secondary="Deleted" />
				</ListItem>
			);
		}
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
				open={show && selfShow}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				maxWidth="xs"
				fullWidth={true}
				fullScreen={width < 500}
				onEntering={entering}
				onExit={exiting}
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
