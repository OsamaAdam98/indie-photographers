import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import React, { lazy, memo, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/AppContext";

const FavoriteIcon = lazy(() => import("@material-ui/icons/Favorite"));
const MoreVertIcon = lazy(() => import("@material-ui/icons/MoreVert"));
const ShareIcon = lazy(() => import("@material-ui/icons/Share"));
const PhotoPreview = lazy(() => import("./modals/PhotoPreview"));
const Likes = lazy(() => import("./modals/Likes"));

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "31.25rem",
    marginBottom: theme.spacing(2),
  },
  media: {
    maxHeight: "15.625rem",
  },
}));

interface Props {
  feedPost: Post;
  handleDelete: (id: string) => void;
}

const PostMedia: React.FC<Props> = ({ feedPost, handleDelete }) => {
  const classes = useStyles();
  const { user } = feedPost;
  const currentUser = React.useContext(UserContext).user;

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [liked, setLiked] = useState<boolean>(
    feedPost?.likes?.filter((like) => like.user._id === currentUser._id).length
      ? true
      : false
  );

  const [likePost, likeResult] = useMutation<{ like: boolean }>(gql`
    mutation Like($id: ID!) {
      like(id: $id)
    }
  `);

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (likeResult.data && !likeResult.loading) setLiked(likeResult.data.like);
  }, [likeResult]);

  const handleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let date = new Date(feedPost.date);

  if (user) {
    return (
      <Suspense fallback={<div />}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Link to={`/profile/${user._id}`}>
                <Avatar
                  alt="user avatar"
                  src={user.profilePicture ? user.profilePicture : ""}
                />
              </Link>
            }
            action={
              currentUser._id === user._id || currentUser.admin ? (
                <>
                  <IconButton
                    aria-label="settings"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleDelete(feedPost._id)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </>
              ) : null
            }
            title={
              <Link to={`/profile/${user._id}`} className="text-link">
                <Typography variant="subtitle1" color="inherit">
                  {user.username}
                </Typography>
              </Link>
            }
            subheader={`Posted ${moment(date).fromNow()}`}
          />
          <CardContent>
            <Typography variant="body2" component="p" dir="auto">
              {feedPost.msg}
            </Typography>
          </CardContent>
          {feedPost.photo ? (
            <CardMedia className={classes.media}>
              <PhotoPreview
                realPhoto={feedPost.photo}
                // TODO: super hacky, remove before production!
                photo={feedPost.photo as string}
                alt={feedPost.user.username}
                maxHeight={250}
              />
            </CardMedia>
          ) : (
            ""
          )}
          <Likes
            liked={liked}
            users={feedPost?.likes?.map((like) => like.user)}
            currentUser={currentUser}
          />
          <CardActions disableSpacing>
            <IconButton
              aria-label="love"
              onClick={() => likePost({ variables: { id: feedPost._id } })}
            >
              <FavoriteIcon color={liked ? "secondary" : "disabled"} />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Suspense>
    );
  } else {
    return null;
  }
};

export default memo(PostMedia);
