import { Button, makeStyles, Typography } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import axios from "axios";
import React from "react";
import useFacebook from "react-easy-facebook";
import { actions } from "../../reducers/appReducer";
import { FacebookResponse } from "react-easy-facebook/dist/types";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  fbBtn: {
    backgroundColor: "#4267B2",
    width: "100%",
    height: 44,
    "&:hover": {
      backgroundColor: "#4F6FBF",
    },
    borderRadius: 2,
    justifyContent: "left",
  },
  fbIcon: {
    position: "absolute",
    left: 6,
    color: "#4F6FBF",
  },
  fbType: {
    fontSize: 14,
    postion: "relative",
    marginLeft: 30,
  },
  btnDiv: {
    height: 42,
    width: 38,
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    marginRight: 10,
    padding: 10,
    borderRadius: 2,
  },
}));

interface Props {
  handleClose: () => void;
  dispatch: React.Dispatch<actions>;
}

const appId = "608523869954489";

const FBButton: React.FC<Props> = ({ dispatch, handleClose }) => {
  const classes = useStyles();

  const { response, login } = useFacebook({
    appId,
    fields: "name,email,picture.width(800).height(800)",
  });

  const sendUser = React.useCallback(
    async (response: FacebookResponse, dispatch: React.Dispatch<actions>) => {
      try {
        const res = await axios.post<{ token?: string; user?: User }>(
          `/api/auth/facebook-login`,
          response
        );

        const { token, user } = res.data;
        if (token) {
          localStorage.setItem("token", token);
        }
        if (user) {
          dispatch({ type: "setUser", user });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        dispatch({
          type: "showSnackAlert",
          errorMsg: "Login failed!",
          severity: "error",
        });
      }
    },
    []
  );

  React.useEffect(() => {
    if (response) sendUser(response, dispatch);
  }, [response, sendUser, dispatch]);

  return (
    <>
      <Button
        onClick={() => login()}
        variant="contained"
        color="inherit"
        className={classes.fbBtn}
      >
        <div className={classes.btnDiv} />
        <FacebookIcon
          color="inherit"
          fontSize="default"
          className={classes.fbIcon}
        />
        <Typography variant="button" className={classes.fbType}>
          Facebook
        </Typography>
      </Button>
    </>
  );
};

export default FBButton;
