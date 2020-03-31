import { Avatar, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import ViewDayIcon from "@material-ui/icons/ViewDay";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/AppContext";
import { useWindowDimensions } from ".";

const useStyles = makeStyles((theme) => ({
  tabs: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    boxShadow: "0px -1px 5px 1px rgba(0, 0, 0, .3)"
  }
}));

const BottomBar: React.FC = () => {
  const [value, setValue] = useState<number | boolean>(false);

  const classes = useStyles();
  const location = useLocation();
  const { width } = useWindowDimensions();
  const { user } = React.useContext(UserContext);

  useEffect(() => {
    switch (location.pathname) {
      case "/feed/":
        setValue(1);
        break;
      case `/profile/${user._id}`:
        setValue(2);
        break;
      case "/settings":
        setValue(3);
        break;
      case "/":
        setValue(0);
        break;
      default:
        setValue(false);
        break;
    }
  }, [location.pathname, user]);

  const history = useHistory();

  const handleChange = (event: any, val: number | boolean) => {
    setValue(val);

    switch (val) {
      case 0:
        history.push("/");
        break;
      case 1:
        if (location.pathname === "/feed/")
          window.scroll({
            top: 0,
            left: 0,
            behavior: "auto"
          });
        history.push("/feed/");
        break;
      case 2:
        if (location.pathname === `/profile/${user._id}`)
          window.scroll({
            top: 0,
            left: 0,
            behavior: "auto"
          });
        break;
      case 3:
        history.push("/settings");
        break;
      default:
        break;
    }
  };

  return (
    <Paper square>
      <Tabs
        value={value}
        onChange={handleChange}
        variant={width < 600 ? "fullWidth" : "standard"}
        indicatorColor="primary"
        textColor="primary"
        aria-label="Site navigation"
        className={classes.tabs}
        centered
      >
        <Tab icon={<HomeIcon />} aria-label="Home" />

        <Tab icon={<ViewDayIcon />} aria-label="Feed" />

        <Tab
          icon={
            <Avatar
              src={user.profilePicture}
              style={{
                width: 24,
                height: 24
              }}
            />
          }
          aria-label="Profile"
          onClick={() => {
            history.push(`/profile/${user._id}`);
          }}
          style={{
            display: user.username ? "" : "none"
          }}
        />

        <Tab
          icon={<SettingsIcon />}
          aria-label="Settings"
          style={{
            display: user.username ? "none" : ""
          }}
        />
      </Tabs>
    </Paper>
  );
};

export default React.memo(BottomBar);
