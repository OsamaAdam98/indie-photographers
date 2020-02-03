import React from "react";
import "../../css/profile.css";
import {Paper, Typography} from "@material-ui/core";

export default function ProfileSkeleton() {
	return (
		<div className="container">
			<Paper className="main-block">
				<div className="cover-photo" />
				<div className="profile-photo" />
				<div className="tagline">
					<Typography
						style={{
							fontStyle: "italic"
						}}
					>
						<span className="highlight">title</span>
					</Typography>
				</div>
				<div className="main-info"></div>
			</Paper>
		</div>
	);
}
