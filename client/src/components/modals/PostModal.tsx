import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FAB, resizeImage } from "../index";
import useWindowDimensions from "../utilities/WindowDimensions";

interface Props {
  isLogged: boolean;
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

interface PostMutation {
  post: Post;
}

const PostModal: React.FC<Props> = (props) => {
  const {
    isLogged,
    setNewPost,
    photo,
    setPhoto,
    isUploading,
    onUpload,
    offline,
    handleCancel,
    realPhoto,
    setIsUploading,
  } = props;

  const location = useLocation();
  const { height } = useWindowDimensions();
  const [show, setShow] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const [addPost, { error, loading, data, called }] = useMutation<PostMutation>(
    gql`
      mutation Post($msg: String, $photo: String) {
        post(msg: $msg, photo: $photo) {
          _id
          msg
          photo
          date
          user {
            _id
            username
            admin
            profilePicture
          }
        }
      }
    `,
    { variables: { msg, photo } }
  );

  useEffect(() => {
    if (location.hash !== "#feed-post") setShow(false);
  }, [location.hash]);

  const msgChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMsg(event.target.value);

  const handleClose = React.useCallback(() => {
    setErrorMsg("");
    setMsg("");
    setPhoto("");
    setShow(false);
    window.location.hash = "";
  }, [setPhoto]);

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
    if (!msg.trim() && !photo.trim()) {
      setErrorMsg("Surely you'd like to write something!");
    } else {
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
            addPost();
          } catch (err) {
            if (err.message === "too-large") {
              setErrorMsg("File too large");
            }
          }
        };
      } else {
        addPost();
      }
    }
  };

  React.useEffect(() => {
    if (called && data?.post && !loading) {
      setNewPost((prevPosts) => [data.post, ...prevPosts]);
      setPhoto("");
      setMsg("");
      setIsUploading(false);
      handleClose();
    }
    if (error) console.error(error);
  }, [
    setNewPost,
    setPhoto,
    setIsUploading,
    handleClose,
    called,
    data,
    loading,
    error,
  ]);

  const subButton = isLogged ? (
    <FAB
      handleClick={handleShow}
      offline={offline}
      currentLocation="/feed"
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
                maxHeight: `${height / 2}px`,
              }}
            />
          </DialogContent>
          <DialogActions>
            <div
              style={{
                position: "absolute",
                left: "1rem",
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
