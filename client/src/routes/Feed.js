import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	lazy,
	Suspense
} from "react";
import axios from "axios";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import {LinearProgress, makeStyles} from "@material-ui/core";
import {PostModal, PostSkeleton, SnackAlert} from "../components";
import "../css/feed.css";

const PostMedia = lazy(() => import("../components/PostMedia"));

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
	const [showLikes, setShowLikes] = useState(false);
	const [showPrev, setShowPrev] = useState(false);
	const [showPost, setShowPost] = useState(false);
	const [offline, setOffline] = useState(false);

	const hideAll = () => {
		setShowPrev(false);
		setShowPost(false);
		setShowLikes(false);
	};

	useEffect(() => {
		if (props.location.hash === "") hideAll();
	}, [props.location.hash]);

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
				setErrorMsg("Upload failed!");
				console.log(err);
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
		let cachedData = JSON.parse(localStorage.getItem(`feedPage${page}`));
		if (cachedData) {
			setPosts((prevPosts) => [...prevPosts, ...cachedData]);
			setIsLoading(false);
			setHasMore(cachedData.length > 0);
		}

		axios
			.get(`/api/feed/?page=${page}`)
			.then((res) => {
				const {data} = res;
				if (getNewPosts(data, cachedData)) {
					setNewPost((prevPosts) => [
						...prevPosts,
						...getNewPosts(data, cachedData)
					]);
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
				if (err) {
					setErrorMsg("Can't connect to the internet!");
					setSeverity("warning");
					setOffline(true);
					setOpenError(true);
					console.log(err);
					if (cachedData) {
						setHasMore(cachedData.length > 0);
					} else {
						setHasMore(false);
					}
					setIsLoading(false);
				}
			});
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
						showLikes={showLikes}
						setShowLikes={setShowLikes}
						showPrev={showPrev}
						setShowPrev={setShowPrev}
						feedPost={feedPost}
						isLoading={isLoading}
						currentUser={user}
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
						showLikes={showLikes}
						setShowLikes={setShowLikes}
						showPrev={showPrev}
						setShowPrev={setShowPrev}
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
					showLikes={showLikes}
					setShowLikes={setShowLikes}
					showPrev={showPrev}
					setShowPrev={setShowPrev}
					feedPost={incoming}
					isLoading={isLoading}
					currentUser={user}
					handleDelete={handleDelete}
					key={incoming._id}
					{...props}
				/>
		  ))
		: null;

	return (
		<div className="feed-container">
			<div className="feed-post-block">
				<Suspense fallback={<PostSkeleton />}>
					{newPost && newPosts}
					{postMedia}
				</Suspense>
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
					isLogged={isLogged}
					user={user}
					setNewPost={setNewPost}
					photo={photo}
					setPhoto={setPhoto}
					isUploading={isUploading}
					onUpload={onUpload}
					show={showPost}
					setShow={setShowPost}
					offline={offline}
					{...props}
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
