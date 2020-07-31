import { Paper, Typography } from "@material-ui/core";
import React from "react";
import "../../scss/profile.scss";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container">
      <Paper className="main-block">
        <div className="cover-photo" />
        <div className="tagline">
          <Typography
            style={{
              fontStyle: "italic",
            }}
          >
            <span className="highlight">title</span>
          </Typography>
        </div>
        <div className="main-info"></div>
      </Paper>
    </div>
  );
};

export default ProfileSkeleton;
