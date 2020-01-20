import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {ListItem, ListItemText, ListItemAvatar} from "@material-ui/core";

export default function LikesSkeleton(props) {
	const {likes} = props;
	let skeleton = [];

	for (let i = 0; i < likes; i++) {
		skeleton = [
			...skeleton,
			<ListItem key={i}>
				<ListItemAvatar>
					<Skeleton variant="circle" width={40} height={40} />
				</ListItemAvatar>
				<ListItemText>
					<Skeleton height={10} width="80%" style={{marginBottom: 6}} />
					<Skeleton height={10} width="40%" />
				</ListItemText>
			</ListItem>
		];
	}

	return <>{skeleton}</>;
}
