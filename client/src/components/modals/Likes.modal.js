import React, {useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Dialog,
	DialogContent,
	DialogTitle,
	Avatar,
	Divider,
	makeStyles,
	Badge
} from "@material-ui/core";
import {AvatarGroup} from "@material-ui/lab";
import {useWindowDimensions} from "..";

const useStyles = makeStyles((theme) => ({
	avGrp: {
		marginLeft: theme.spacing(3),
		marginTop: theme.spacing(2),
		maxWidth: theme.spacing(9),
		"&:hover": {
			cursor: "pointer"
		}
	},
	avatar: {
		height: theme.spacing(3),
		width: theme.spacing(3)
	},
	badge: {
		"&:hover": {
			cursor: "pointer"
		}
	}
}));

export default function Likes(props) {
	const {users, show, setShow, liked, currentUser} = props;
	const [selfShow, setSelfShow] = useState(false);
	const {width} = useWindowDimensions();

	const history = useHistory();
	const classes = useStyles();

	useEffect(() => {
		if (props.location.hash === "") handleClose();
		// eslint-disable-next-line
	}, [props.location.hash]);

	const entering = () => {
		handleShow();
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
	let i = 0;

	const AvatarArray = () => (
		<>
			{liked && (
				<Avatar
					className={classes.avatar}
					alt={currentUser.username}
					src={currentUser.profilePicture}
				/>
			)}
			{users.map((user) => {
				if (user._id !== currentUser._id && (liked ? i < 2 : i < 3)) {
					// this shouldn't work but it does
					i++;
					return (
						<Avatar
							key={user._id}
							className={classes.avatar}
							alt={user.username}
							src={user.profilePicture}
						/>
					);
				}
				return null;
			})}
		</>
	);

	const likeGroup = users && (
		<Badge
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right"
			}}
			badgeContent={users.length + (liked ? 1 : 0) > 3 ? users.length - 3 : 0}
			color="primary"
			max={99}
			onClick={handleShow}
			className={classes.badge}
		>
			<AvatarGroup className={classes.avGrp} onClick={handleShow}>
				<AvatarArray />
			</AvatarGroup>
		</Badge>
	);

	return (
		<>
			{likeGroup}
			<Dialog
				open={show && selfShow}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				maxWidth="xs"
				fullWidth={true}
				fullScreen={width < 500}
				onEntering={entering}
				scroll="paper"
			>
				<DialogTitle
					id="form-dialog-title"
					style={{
						height: width > 500 ? "1rem" : "3.5rem"
					}}
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
						{likedUsers}
					</List>
				</DialogContent>
			</Dialog>
		</>
	);
}
