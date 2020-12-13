import { Fab, makeStyles, useTheme, Zoom } from "@material-ui/core";
import React from "react";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: "relative",
    minHeight: 200,
  },
  customFab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 70,
    left: "auto",
    position: "fixed",
  },
  "@media (min-width: 31.25rem)": {
    customFab: {
      margin: 0,
      top: "auto",
      right: 20,
      bottom: 20,
      left: "auto",
      position: "fixed",
    },
  },
}));

interface Props {
  currentLocation: "/feed";
  offline: boolean;
  icon: JSX.Element;
  handleClick: () => void;
}

const FAB: React.FC<Props> = ({
  currentLocation,
  offline,
  icon,
  handleClick,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Zoom
      in={location.pathname === currentLocation}
      timeout={transitionDuration}
      style={{
        display: offline ? "none" : "",
        transitionDelay: `${
          location.pathname === currentLocation ? transitionDuration.exit : 0
        }ms`,
      }}
      unmountOnExit
    >
      <Fab
        aria-label={"Edit"}
        className={classes.customFab}
        color={"primary"}
        onClick={handleClick}
      >
        {icon}
      </Fab>
    </Zoom>
  );
};

export default FAB;
