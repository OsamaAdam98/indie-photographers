import React, {useState, useEffect, useRef, useCallback} from "react";
import axios from "axios";
import Loadingpage from "../components/Loadingpage";
import FeedPost from "../components/FeedPost";
import PostModal from "../components/modals/FeedPost.modal";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		position: "relative",
		minHeight: 200
	}
}));

export default function Feed(props) {
	const classes = useStyles();
	const {isLogged, user} = props;

	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		console.log(page);
		axios
			.get(`/api/feed/?page=${page}`)
			.then((res) => {
				const {data} = res;
				setPosts((prevPosts) =>
					[...prevPosts, ...data].sort((a, b) => {
						let dateA = new Date(a.post.date);
						let dateB = new Date(b.post.date);
						return dateB - dateA;
					})
				);
				setIsLoading(false);
				setHasMore(data.length > 0);
			})
			.catch((err) => console.log(err));
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
				<div ref={lastElementRef} key={i}>
					<FeedPost feedPost={feedPost} />
				</div>
			);
		} else {
			return (
				<div key={i}>
					<FeedPost feedPost={feedPost} />
				</div>
			);
		}
	});

	// if (isLoading) return <Loadingpage />;
	return (
		<div className={(classes.root, `container-fluid`)}>
			{postMedia}
			<PostModal isLogged={isLogged} user={user} />
		</div>
	);
}
