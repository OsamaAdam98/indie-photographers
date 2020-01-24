import React, {useState, useEffect, useRef, useCallback} from "react";
import axios from "axios";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import {LinearProgress, Grid, Box} from "@material-ui/core";
import {
	PostMedia,
	PostModal,
	PostSkeleton,
	SnackAlert,
	useWindowDimensions
} from "../components";

export default function Feed(props) {
	const {isLogged, user} = props;
	const {width} = useWindowDimensions();

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
		setShowLikes(false);
		setShowPost(false);
		setShowPrev(false);
	};

	useEffect(() => {
		if (props.location.hash === "") hideAll();
	});

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

	const updatePage = (cachedData, page, id) => {
		localStorage.setItem(
			`feedPage${page}`,
			JSON.stringify(cachedData.filter((data) => data._id !== id))
		);
		if (page !== 1) {
			localStorage.setItem(
				`feedPage1`,
				JSON.stringify(
					JSON.parse(localStorage.getItem("feedPage1")).filter(
						(data) => data._id !== id
					)
				)
			);
		}
	};

	const handleDelete = (id) => {
		const token = localStorage.getItem("token");
		const cachedData = JSON.parse(localStorage.getItem(`feedPage${page}`));

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				updatePage(cachedData, page, id);
				setErrorMsg(res.data);
				setSeverity("success");
				setOpenError(true);
			})
			.then(() => window.location.reload())
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
				/>
		  ))
		: null;

	return (
		<>
			<LinearProgress
				variant="determinate"
				value={uploadProgress}
				color="secondary"
				style={{
					position: "fixed",
					top: "0px",
					width: "100%",
					height: "4.4rem",
					display: isUploading ? `` : `none`
				}}
			/>

			<Grid container direction="column" alignItems="center" justify="center">
				<Box maxWidth="500px" width={`${width > 500 ? `500px` : `100%`}`}>
					{newPost && newPosts}
					{postMedia}
					{isLoading ? <PostSkeleton /> : null}
					{!hasMore && !isLoading ? (
						<DoneAllIcon
							style={{
								position: "relative",
								width: "100%",
								textAlign: "center",
								marginBottom: "4rem"
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
				</Box>
			</Grid>
		</>
	);
}
