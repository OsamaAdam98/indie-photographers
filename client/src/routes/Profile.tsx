import React, {useState, useEffect, useRef} from "react";
import {RouteComponentProps} from "react-router-dom";
import axios from "axios";
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
import {Skeleton} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		maxWidth: 360,
		padding: theme.spacing(2)
	}
}));

interface Props extends RouteComponentProps<MatchParams> {
	currentUser: User;
}

const Profile: React.FC<Props> = (props) => {
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [openError, setOpenError] = useState<boolean>(false);
	const [severity, setSeverity] = useState<string>("");
	const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

	const {currentUser, match} = props;

	const classes = useStyles();

	const handleDelete = (id: string) => {
		const token: string | null = JSON.parse(
			localStorage.getItem("token") as string
		);

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				setErrorMsg(res.data as string);
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		setIsLoading(true);
		if (match.params.id) {
			let cachedData: Post[] = JSON.parse(
				localStorage.getItem(`${match.params.id}/page${page}`) as string
			);
			if (cachedData) {
				setPosts((prevPosts) =>
					[...prevPosts, ...cachedData].filter(
						(post) => post.user._id === match.params.id
					)
				);
				setIsLoading(false);
				setHasMore(cachedData.length > 0);
			} else {
				axios
					.get(`/api/feed/user/${match.params.id}/?page=${page}`)
					.then((res) => {
						const data: Post[] = res.data;

						setPosts((prevPosts) => [...prevPosts, ...data]);

						setHasMore(data.length > 0);
						localStorage.setItem(
							`${match.params.id}/page${page}`,
							JSON.stringify(
								data.filter((post) => post.user._id === match.params.id)
							)
						);
						setErrorMsg("");
						setOpenError(false);
						setIsLoading(false);
					})
					.catch((err) => {
						if (err) {
							if (cachedData) {
								setHasMore(cachedData.length > 0);
							} else {
								setHasMore(false);
							}
							if (err) {
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
		}
	}, [page, match.params.id]);

	useEffect(() => {
		if (match.params.id) {
			let cachedData: User = JSON.parse(
				localStorage.getItem(`${match.params.id}`) as string
			);
			if (cachedData) setUser(cachedData);

			axios
				.get(`/api/users/${match.params.id}`)
				.then((res) => {
					const data: User = res.data;
					setUser(data);
					localStorage.setItem(`${match.params.id}`, JSON.stringify(data));
				})
				.catch((err) => {
					if (err) {
						setErrorMsg("Can't find user");
						setSeverity("error");
						setOpenError(true);
					}
				});
		}
	}, [match.params.id]);

	const observer = useRef(
		new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting) {
				setPage((page) => page + 1);
			}
		})
	);

	useEffect(() => {
		const currentElement = lastElement;
		const currentObserver = observer.current;

		if (currentElement) currentObserver.observe(currentElement);

		return () => {
			if (currentElement) currentObserver.unobserve(currentElement);
		};
	}, [lastElement]);

	const postMedia = posts
		? posts.map((feedPost, i) => {
				if (posts.length === i + 1) {
					return (
						<div ref={setLastElement} key={feedPost._id}>
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
				{isLoading ? (
					<Skeleton
						height="100%"
						width="auto"
						variant="circle"
						className="profile-photo"
					/>
				) : (
					<PhotoPreview
						{...props}
						photo={user && user.profilePicture}
						alt={user && user.username}
						round={true}
					/>
				)}
				<div className="tagline">
					<Typography variant="h5">{user && user.username}</Typography>
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
};

export default Profile;
