import { useLazyQuery } from "@apollo/react-hooks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { gql } from "apollo-boost";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FBButton, GoogleBtn, ProfileAvatar } from "..";
import UserContext, { DispatchContext } from "../../context/AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
}));

interface UserQuery {
  login: {
    token: string;
    user: User;
  };
}

const Login: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  const { dispatch } = React.useContext(DispatchContext);
  const state = React.useContext(UserContext);

  const [show, setShow] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [signUser, userQuery] = useLazyQuery<UserQuery>(
    gql`
      query User($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          msg
          user {
            _id
            username
            email
            registerDate
            admin
            profilePicture
          }
        }
      }
    `,
    { variables: { email, password } }
  );

  useEffect(() => {
    if (location.hash !== "#login-window") setShow(false);
  }, [location.hash]);

  const handleEnter = (target: any) => {
    target.charCode === 13 && handleSubmit();
  };

  const handleClose = React.useCallback(() => {
    setShow(false);
    setErrorMsg("");
    window.location.hash = "";
  }, []);

  const handleShow = () => {
    setShow(true);
    window.location.hash = "login-window";
    setErrorMsg("");
  };

  const emailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleSubmit = (
    event?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter all fields");
    } else {
      try {
        signUser();
      } catch (error) {
        dispatch({ type: "clearUser" });
        setErrorMsg("Invalid credentials");
      }
    }
    event?.preventDefault();
  };

  React.useEffect(() => {
    if (userQuery.data && !userQuery.loading) {
      const { token, user } = userQuery.data.login;
      localStorage.setItem("token", token);
      dispatch({ type: "setUser", user });
      handleClose();
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  }, [userQuery, handleClose, dispatch]);

  const loginButton = !state.isLogged ? (
    <Button color="inherit" onClick={handleShow}>
      Login
    </Button>
  ) : (
    <ProfileAvatar dispatch={dispatch} />
  );

  return (
    <>
      {loginButton}
      <Dialog open={show} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit} className={classes.root}>
          <DialogTitle id="form-dialog-title">Login</DialogTitle>

          <DialogContent>
            <TextField
              className={classes.textField}
              variant="outlined"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={emailChange}
              onKeyPress={handleEnter}
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              id="password"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={passwordChange}
              error={!!errorMsg}
              helperText={errorMsg}
              onKeyPress={handleEnter}
            />
            <Grid container direction="row" spacing={1}>
              <Grid item xs>
                <FBButton handleClose={handleClose} dispatch={dispatch} />
              </Grid>
              <Grid item xs>
                <GoogleBtn handleClose={handleClose} dispatch={dispatch} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit} color="primary">
              Login
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Login;
