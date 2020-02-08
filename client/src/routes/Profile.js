import React, {useState, useEffect, useRef, useCallback} from "react";
import axios, {CancelToken} from "axios";
import {
	Paper,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	makeStyles
} from "@material-ui/core";
import "../css/profile.css";
import {
	PostMedia,
	PostSkeleton,
	SnackAlert,
	PhotoPreview
} from "../components/index";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		maxWidth: 360,
		padding: theme.spacing(2)
	}
}));

export default function Profile(props) {
	const {currentUser} = props;
	const [user, setUser] = useState("");
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [openError, setOpenError] = useState(false);
	const [severity, setSeverity] = useState("");

	const classes = useStyles();

	const handleDelete = (id) => {
		const token = localStorage.getItem("token");

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				setErrorMsg(res.data);
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		let cachedData = JSON.parse(
			localStorage.getItem(`${user._id}/page${page}`)
		);
		if (cachedData) {
			setPosts((prevPosts) =>
				[...prevPosts, ...cachedData].filter(
					(post) => post.user._id === user._id
				)
			);
			setIsLoading(false);
			setHasMore(cachedData.length > 0);
		}

		if (user) {
			axios
				.get(`/api/feed/user/${user._id}/?page=${page}`)
				.then((res) => {
					const {data} = res;

					if (!cachedData) {
						setPosts((prevPosts) => [...prevPosts, ...data]);
					}

					setHasMore(data.length > 0);
					localStorage.setItem(
						`${user._id}/page${page}`,
						JSON.stringify(data.filter((post) => post.user._id === user._id))
					);
					setErrorMsg("");
					setOpenError(false);
					setIsLoading(false);
				})
				.catch((err) => {
					if (err) {
						const {status} = err.response;
						if (cachedData) {
							setHasMore(cachedData.length > 0);
						} else {
							setHasMore(false);
						}
						if (status === 404) {
							setErrorMsg("User not found");
							setSeverity("error");
							setOpenError(true);
						} else {
							setErrorMsg("Can't connect to the internet!");
							setSeverity("warning");
							setOpenError(true);
						}
						setIsLoading(false);
					}
				});
		}
	}, [page, user]);

	useEffect(() => {
		setPosts([]);
		setPage(1);
		let cancel;

		let cachedData = JSON.parse(
			localStorage.getItem(`${props.match.params.id}`)
		);
		if (cachedData) setUser(cachedData);

		axios
			.get(`/api/users/${props.match.params.id}`, {
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				})
			})
			.then((res) => {
				const {data} = res;
				if (!cachedData) setUser(data);
				localStorage.setItem(`${props.match.params.id}`, JSON.stringify(data));
			})
			.catch((err) => {
				const {status} = err.response;
				if (status === 404) {
					setErrorMsg("Can't find user");
					setSeverity("error");
					setOpenError(true);
				}
			});

		return () => cancel();
	}, [props.match.params.id]);

	const observer = useRef();

	const lastElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	const postMedia = posts
		? posts.map((feedPost, i) => {
				if (posts.length === i + 1) {
					return (
						<div ref={lastElementRef} key={feedPost._id}>
							<PostMedia
								{...props}
								feedPost={feedPost}
								isLoading={isLoading}
								currentUser={currentUser}
								handleDelete={handleDelete}
							/>
							{hasMore ? <PostSkeleton /> : null}
						</div>
					);
				} else {
					return (
						<div key={feedPost._id}>
							<PostMedia
								{...props}
								feedPost={feedPost}
								isLoading={isLoading}
								currentUser={currentUser}
								handleDelete={handleDelete}
							/>
						</div>
					);
				}
		  })
		: null;

	return (
		<div className="container">
			<Paper className="main-block">
				<div className="cover-photo" />
				<PhotoPreview
					{...props}
					photo={user.profilePicture}
					username={user.username}
					round={true}
				/>
				<div className="tagline">
					<Typography variant="h5">{user.username}</Typography>
					<Typography
						style={{
							fontStyle: "italic"
						}}
					>
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
			<Paper className="details-block">
				<List className={classes.root}>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<ImageIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Placeholder" secondary="Placeholder" />
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<WorkIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Placeholder" secondary="Placeholder" />
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<BeachAccessIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Placeholder" secondary="Placeholder" />
					</ListItem>
				</List>
			</Paper>
			<div className="post-block">
				{postMedia}
				{!hasMore && !isLoading ? (
					<DoneAllIcon
						style={{
							position: "relative",
							width: "100%",
							textAlign: "center"
						}}
					/>
				) : null}
			</div>
			<SnackAlert
				severity={severity}
				openError={openError}
				setOpenError={setOpenError}
				errorMsg={errorMsg}
			/>
		</div>
	);
}
