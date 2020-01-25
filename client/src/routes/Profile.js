import React, {useState, useEffect, lazy, Suspense} from "react";
import axios from "axios";

import {ProfileSkeleton, useWindowDimensions} from "../components";

const ProfileCard = lazy(() => import("../components/ProfileCard"));

export default function Profile(props) {
	const [username, setUsername] = useState("");
	const [pic, setPic] = useState("");
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (props.location.hash === "") setShow(false);
	}, [props.location.hash]);

	const {width} = useWindowDimensions();

	useEffect(() => {
		let cachedProfile = localStorage.getItem(`${props.match.params.id}`);
		if (cachedProfile) {
			const {username, profilePicture} = JSON.parse(cachedProfile);
			setUsername(username);
			setPic(profilePicture);
		}
		axios
			.get(`/api/users/profile/${props.match.params.id}`)
			.then((res) => {
				const {data} = res;
				if (!cachedProfile) {
					setUsername(data.username);
					setPic(data.profilePicture);
				}
				localStorage.setItem(`${props.match.params.id}`, JSON.stringify(data));
			})
			.catch((err) => console.log(err));
	}, [props.match.params.id]);

	return (
		<Suspense fallback={<ProfileSkeleton />}>
			<ProfileCard
				width={width}
				pic={pic}
				username={username}
				show={show}
				setShow={setShow}
				{...props}
			/>
		</Suspense>
	);
}
