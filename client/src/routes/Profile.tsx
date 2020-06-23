import { useQuery } from "@apollo/react-hooks";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { gql } from "apollo-boost";
import axios from "axios";
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { PhotoPreview, PostSkeleton } from "../components/index";
import { DispatchContext } from "../context/AppContext";
import "../scss/profile.scss";

const PostMedia = lazy(() => import("../components/PostMedia"));
const DoneAllIcon = lazy(() => import("@material-ui/icons/DoneAll"));
const ImageIcon = lazy(() => import("@material-ui/icons/Image"));
const WorkIcon = lazy(() => import("@material-ui/icons/Work"));
const BeachAccessIcon = lazy(() => import("@material-ui/icons/BeachAccess"));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    padding: theme.spacing(2),
  },
}));

interface FeedData {
  posts: Post[];
}

interface UserData {
  user: User;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

  const appDispatch = useCallback(
    React.useContext(DispatchContext).dispatch,
    []
  );

  const classes = useStyles();
  const params: { id?: string } = useParams();

  const handleDelete = (id: string) => {
    const token: string | null = localStorage.getItem("token");

    axios
      .delete(`/api/feed/delete/${id}`, {
        headers: {
          "x-auth-token": `${token}`,
        },
      })
      .then((res) => {
        appDispatch({
          type: "showSnackAlert",
          errorMsg: res.data,
          severity: "success",
        });
      })
      .catch((err) => console.log(err));
  };

  const feedQuery = useQuery<FeedData>(
    gql`
      query UserFeed($id: ID!, $page: Int!) {
        posts: feedByUserId(id: $id, page: $page) {
          _id
          msg
          photo
          date
          likes {
            _id
            user {
              _id
              username
              profilePicture
              admin
            }
          }
        }
      }
    `,
    { variables: { id: params.id, page } }
  );

  const userQuery = useQuery<UserData>(
    gql`
      query User($id: ID!) {
        user: user(id: $id) {
          _id
          username
          profilePicture
          admin
        }
      }
    `,
    { variables: { id: params.id } }
  );

  React.useEffect(() => {
    if (feedQuery.data && !feedQuery?.loading) {
      const { posts } = feedQuery.data;
      setPosts((prevPosts) => [...new Set([...prevPosts, ...posts])]);
      setHasMore(posts.length === 10);
      appDispatch({ type: "hideSnackAlert" });
    }
    if (userQuery.data && !userQuery.loading) {
      const { user } = userQuery.data;
      setUser(user);
      appDispatch({ type: "hideSnackAlert" });
    }

    if (feedQuery.error || userQuery.error) {
      appDispatch({
        type: "showSnackAlert",
        errorMsg: "User not found",
        severity: "error",
      });
    }
  }, [feedQuery, userQuery, params.id, appDispatch]);

  const observer = useRef(
    new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setPage((page) => page + 1);
      }
    })
  );

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) currentObserver.observe(currentElement);

    return () => {
      if (currentElement) currentObserver.unobserve(currentElement);
    };
  }, [lastElement]);

  const postMedia = posts
    ? posts.map((feedPost, i) => {
        if (posts.length === i + 1) {
          return (
            <div ref={setLastElement} key={feedPost._id}>
              <PostMedia
                feedPost={{ ...feedPost, user: user! }}
                handleDelete={handleDelete}
              />
              {hasMore ? <PostSkeleton /> : null}
            </div>
          );
        } else {
          return (
            <div key={feedPost._id}>
              <PostMedia
                feedPost={{ ...feedPost, user: user! }}
                handleDelete={handleDelete}
              />
            </div>
          );
        }
      })
    : null;

  return (
    <div className="profile__container">
      {user ? (
        <>
          <Paper className="main-block">
            <div className="cover-photo" />
            <PhotoPreview
              photo={user.profilePicture}
              alt={user.username}
              round={true}
            />
            <div className="tagline">
              <Typography variant="h5">{user.username}</Typography>
              <Typography
                style={{
                  fontStyle: "italic",
                }}
              >
                <span className="highlight">title</span>
              </Typography>
            </div>
            <div className="main-info">
              <Typography>
                Irure culpa sint tempor Lorem Lorem eu eu consequat in elit.
                Laborum id magna mollit pariatur. Incididunt velit mollit sit
                aliqua duis esse nisi velit esse ad occaecat voluptate aliqua
                esse. Adipisicing pariatur sint consequat ea et pariatur sint
                nisi anim.
              </Typography>
            </div>
          </Paper>
          <Paper className="details-block">
            <List className={classes.root}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Placeholder" secondary="Placeholder" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Placeholder" secondary="Placeholder" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <BeachAccessIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Placeholder" secondary="Placeholder" />
              </ListItem>
            </List>
          </Paper>
        </>
      ) : null}

      <div className="post-block">
        <Suspense fallback={<div />}>{postMedia}</Suspense>

        {!hasMore && !feedQuery.loading ? (
          <Suspense fallback={<div />}>
            <DoneAllIcon
              style={{
                position: "relative",
                width: "100%",
                textAlign: "center",
              }}
            />
          </Suspense>
        ) : null}
        <div className="invisibleDiv" />
      </div>
    </div>
  );
};

export default React.memo(Profile);
