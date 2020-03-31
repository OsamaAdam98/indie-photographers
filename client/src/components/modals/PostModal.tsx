import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { FAB } from "../index";
import useWindowDimensions from "../utilities/WindowDimensions";
import { resizeImage } from "../index";

interface Props {
  isLogged: boolean;
  user: User;
  photo: string;
  setPhoto: React.Dispatch<React.SetStateAction<string>>;
  realPhoto?: FileList;
  isUploading: boolean;
  offline: boolean;
  setNewPost: React.Dispatch<React.SetStateAction<Post[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PostModal: React.FC<Props> = (props) => {
  const {
    isLogged,
    user,
    setNewPost,
    photo,
    setPhoto,
    isUploading,
    onUpload,
    offline,
    handleCancel,
    realPhoto,
    setIsUploading
  } = props;

  const history = useHistory();
  const location = useLocation();
  const { height } = useWindowDimensions();
  const [show, setShow] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (location.hash !== "#feed-post") setShow(false);
  }, [location.hash]);

  const msgChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMsg(event.target.value);

  const handleClose = () => {
    setErrorMsg("");
    setMsg("");
    setPhoto("");
    setShow(false);
    if (location.hash === "#feed-post") history.goBack();
  };

  const handleShow = () => {
    window.location.hash = "feed-post";
    setShow(true);
    setErrorMsg("");
  };

  const handleSubmit = async (
    event?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>,
    files = realPhoto,
    quality = 0.92
  ) => {
    const username: string | undefined = user.username;
    const email: string | undefined = user.email;

    let subData: SubPost;
    if (!msg.trim() && !photo.trim()) {
      setErrorMsg("Surely you'd like to write something!");
    } else {
      const token = localStorage.getItem("token");

      subData = {
        username,
        email,
        msg
      };

      if (files?.item(0)) {
        setIsUploading(true);
        const image = await resizeImage(files.item(0)!, 800, quality);

        const reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = async () => {
          const base64 = reader.result as string;
          const bufferLength = 100000;
          if (base64.length > bufferLength && quality > 0.1) {
            const newQuality = (bufferLength / base64.length) * quality;
            handleSubmit(undefined, files, newQuality);
            return;
          }

          try {
            if (base64.length > bufferLength) throw new Error("too-large");
            const result = await axios.post(
              `/api/feed/add`,
              { data: subData, photo: base64 },
              {
                headers: {
                  "x-auth-token": `${token}`
                }
              }
            );

            setNewPost((prevPost) => [...prevPost, result.data]);
            setPhoto("");
            setMsg("");
            setIsUploading(false);
            handleClose();
          } catch (err) {
            if (err.message === "too-large") {
              setErrorMsg("File too large");
            }
          }
        };
      } else {
        try {
          const result = await axios.post(
            `/api/feed/add`,
            { data: subData },
            {
              headers: {
                "x-auth-token": `${token}`
              }
            }
          );
          setNewPost((prevPost) => [...prevPost, result.data]);
          setPhoto("");
          setMsg("");
          setIsUploading(false);
          handleClose();
        } catch (err) {
          setErrorMsg(err?.response?.data);
        }
      }
    }
    event?.preventDefault();
  };

  const subButton = isLogged ? (
    <FAB
      handleClick={handleShow}
      offline={offline}
      currentLocation="/feed/"
      icon={<EditIcon />}
    />
  ) : null;

  return (
    <>
      {subButton}
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="xs"
        transitionDuration={{
          enter: 0,
          exit: 0
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Post</DialogTitle>
          <DialogContent>
            <TextField
              id="outlined-textarea"
              label="Message"
              placeholder="What's on your mind?"
              multiline
              variant="outlined"
              value={msg}
              onChange={msgChange}
              fullWidth={true}
              dir="auto"
              error={errorMsg.trim() ? true : false}
              helperText={errorMsg}
            />
            <img
              src={photo}
              alt=""
              style={{
                objectFit: "scale-down",
                objectPosition: "50% 50%",
                display: photo ? `flex` : `none`,
                width: "100%",
                alignItems: "center",
                marginTop: "1rem",
                maxHeight: `${height / 2}px`
              }}
            />
          </DialogContent>
          <DialogActions>
            <div
              style={{
                position: "absolute",
                left: "1rem"
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="outlined-button-file"
                type="file"
                onChange={onUpload}
              />
              <label htmlFor="outlined-button-file">
                <Button component="span" color="primary" disabled={isUploading}>
                  Upload photo
                </Button>
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              color="primary"
              disabled={isUploading}
            >
              Post
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PostModal;
