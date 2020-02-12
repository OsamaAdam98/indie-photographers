import {ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";
import React from "react";

interface Props {
	likes: number;
}

const LikesSkeleton: React.FC<Props> = (props) => {
	const {likes} = props;
	let skeleton: any = [];

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
};

export default LikesSkeleton;
