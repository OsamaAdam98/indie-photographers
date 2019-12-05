import React, {useState, useEffect} from "react";
import axios from "axios";
import Loadingpage from "../components/Loadingpage";
import FeedPost from "../components/FeedPost";

export default function Feed() {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`/api/feed/`)
			.then((res) => {
				const {data} = res;
				setPosts(
					data.sort((a, b) => {
						let dateA = new Date(a.post.date);
						let dateB = new Date(b.post.date);
						return dateB - dateA;
					})
				);
				setIsLoading(false);
			})
			.catch((err) => console.log(`Error: ${err}`));
	}, []);

	const postMedia = posts.map((feedPost, i) => (
		<>
			<FeedPost feedPost={feedPost} key={i} />
			<hr />
		</>
	));

	if (isLoading) return <Loadingpage />;
	return <div className="container">{postMedia}</div>;
}