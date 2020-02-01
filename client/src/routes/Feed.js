import React, {useState, useEffect, useRef, useCallback} from "react";
import axios, {CancelToken} from "axios";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import {LinearProgress, makeStyles} from "@material-ui/core";
import {PostModal, PostSkeleton, SnackAlert, PostMedia} from "../components";
import "../css/feed.css";

const useStyles = makeStyles({
	progress: {
		position: "fixed",
		bottom: 0,
		width: "100%",
		height: 4
	},
	"@media (max-width: 500px)": {
		progress: {
			position: "fixed",
			bottom: 48,
			width: "100%",
			height: 4
		}
	}
});

export default function Feed(props) {
	const {isLogged, user} = props;
	const classes = useStyles();

	const [posts, setPosts] = useState([]);
	const [newPost, setNewPost] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [openError, setOpenError] = useState(false);
	const [severity, setSeverity] = useState("");
	const [photo, setPhoto] = useState("");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [offline, setOffline] = useState(false);

	const config = {
		onUploadProgress: (progressEvent) => {
			setIsUploading(true);
			let percentCompleted = Math.round(
				(progressEvent.loaded * 100) / progressEvent.total
			);
			setUploadProgress(percentCompleted);
		}
	};

	const onUpload = (e) => {
		const files = e.target.files;
		console.log("Clicked");
		const formData = new FormData();
		formData.append("file", files[0]);
		formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

		setErrorMsg(
			"Uploading photo, we'll notify you when the upload is complete."
		);
		setSeverity("info");
		setOpenError(true);

		axios
			.post(process.env.REACT_APP_CLOUDINARY_URL, formData, config)
			.then((res) => {
				setIsUploading(false);
				const {secure_url} = res.data;
				setPhoto(secure_url);
				setErrorMsg("Upload complete!");
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => {
				const {status} = err.response;
				if (status === 500) setErrorMsg("Upload failed!");
			});
	};

	const cleanupDelete = (id) => {
		let index = 1;
		let targetHit;
		let cachedData;
		do {
			cachedData = JSON.parse(localStorage.getItem(`feedPage${index}`));
			if (cachedData) {
				targetHit = cachedData.filter((data) => data._id === id).length
					? true
					: false;
				if (targetHit) {
					setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
					setNewPost((prevPosts) =>
						prevPosts.filter((post) => post._id !== id)
					);

					localStorage.setItem(
						`feedPage${index}`,
						JSON.stringify(cachedData.filter((data) => data._id !== id))
					);
					break;
				}
				index++;
			} else break;
		} while (true);
	};

	const handleDelete = (id) => {
		const token = localStorage.getItem("token");

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				cleanupDelete(id);
				setErrorMsg(res.data);
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => console.log(err));
	};

	const getNewPosts = (newPosts, cachedData) => {
		if (newPosts && cachedData) {
			return newPosts.filter((newPost) => newPost.date > cachedData[0].date);
		} else {
			return null;
		}
	};

	useEffect(() => {
		setIsLoading(true);
		let cancel;

		let cachedData = JSON.parse(localStorage.getItem(`feedPage${page}`));
		if (cachedData) {
			setPosts((prevPosts) => [...prevPosts, ...cachedData]);
			setIsLoading(false);
			setHasMore(cachedData.length > 0);
		}

		axios
			.get(`/api/feed/?page=${page}`, {
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				})
			})
			.then((res) => {
				const {data} = res;
				let newData = getNewPosts(data, cachedData);

				if (newData) {
					setNewPost((prevPosts) => [...prevPosts, ...newData]);
				}

				if (!cachedData) {
					setPosts((prevPosts) => [...prevPosts, ...data]);
				}

				setHasMore(data.length > 0);
				localStorage.setItem(`feedPage${page}`, JSON.stringify(data));
				setErrorMsg("");
				setOpenError(false);
				setOffline(false);
				setIsLoading(false);
			})
			.catch((err) => {
				const {status} = err.response;
				if (status === 500) {
					setErrorMsg("Can't connect to the internet!");
					setSeverity("warning");
					setOffline(true);
					setOpenError(true);
					if (cachedData) {
						setHasMore(cachedData.length > 0);
					} else {
						setHasMore(false);
					}
				}
				setIsLoading(false);
			});
		return () => {
			if (page === 1) cancel();
		};
	}, [page]);

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

	const postMedia = posts.map((feedPost, i) => {
		if (posts.length === i + 1) {
			return (
				<div ref={lastElementRef} key={feedPost._id}>
					<PostMedia
						{...props}
						feedPost={feedPost}
						isLoading={isLoading}
						currentUser={user}
						handleDelete={handleDelete}
					/>
					{hasMore && <PostSkeleton />}
				</div>
			);
		} else {
			return (
				<div key={feedPost._id}>
					<PostMedia
						{...props}
						feedPost={feedPost}
						isLoading={isLoading}
						currentUser={user}
						handleDelete={handleDelete}
					/>
				</div>
			);
		}
	});

	const newPosts = newPost
		? newPost.map((incoming) => (
				<PostMedia
					{...props}
					feedPost={incoming}
					isLoading={isLoading}
					currentUser={user}
					handleDelete={handleDelete}
					key={incoming._id}
				/>
		  ))
		: null;

	return (
		<div className="feed-container">
			<div className="feed-post-block">
				{newPost && newPosts}
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
				<SnackAlert
					severity={severity}
					openError={openError}
					setOpenError={setOpenError}
					errorMsg={errorMsg}
				/>
				<PostModal
					{...props}
					isLogged={isLogged}
					user={user}
					setNewPost={setNewPost}
					photo={photo}
					setPhoto={setPhoto}
					isUploading={isUploading}
					onUpload={onUpload}
					offline={offline}
				/>
			</div>
			{isUploading && (
				<LinearProgress
					variant="determinate"
					value={uploadProgress}
					color="primary"
					className={classes.progress}
				/>
			)}
		</div>
	);
}
