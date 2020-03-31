import { Link, Typography } from "@material-ui/core";
import React from "react";
import "../css/about.css";

const About: React.FC = () => {
  return (
    <div className="about-container">
      <Typography variant="h4" className="headline">
        Hello,
      </Typography>
      <Typography>
        You could checkout the git repository{" "}
        <Link href="https://github.com/OsamaAdam98/indie-photographers">
          here
        </Link>
      </Typography>
    </div>
  );
};

export default React.memo(About);
