import { useQuery } from "@apollo/react-hooks";
import { LinearProgress, makeStyles } from "@material-ui/core";
import { gql } from "apollo-boost";
import axios from "axios";
import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { DispatchContext } from "../context/AppContext";
import "../scss/feed.scss";

const PostMedia = lazy(() => import("../components/PostMedia"));
const PostModal = lazy(() => import("../components/modals/PostModal"));
const PostSkeleton = lazy(() => import("../components/skeletons/PostSkeleton"));
const DoneAllIcon = lazy(() => import("@material-ui/icons/DoneAll"));

const useStyles = makeStyles({
  progress: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100vw",
    height: 4,
  },
  "@media (max-width: 31.25rem)": {
    progress: {
      position: "fixed",
      bottom: 48,
      height: 4,
    },
  },
});

interface Props {
  isLogged: boolean;
  user: User;
}

interface Data {
  posts: Post[];
}

const Feed: React.FC<Props> = ({ isLogged, user }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const appDispatch = useCallback(
    React.useContext(DispatchContext).dispatch,
    []
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [photo, setPhoto] = useState<string>("");
  const [realPhoto, setRealPhoto] = useState<FileList>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(false);
  const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

  const { data, loading, error } = useQuery<Data>(
    gql`
      query User($page: Int!) {
        posts: feedByPage(page: $page) {
          _id
          msg
          photo
          date
          likes {
            _id
            customID
            user {
              _id
              username
              profilePicture
              admin
            }
          }
          user {
            _id
            username
            profilePicture
            admin
          }
        }
      }
    `,
    { variables: { page } }
  );

  React.useEffect(() => {
    if (data?.posts && !loading) {
      const { posts } = data;
      setPosts((prevPosts) => [...new Set([...prevPosts, ...posts])]);
      setHasMore(posts.length === 10);
      setOffline(false);
      appDispatch({ type: "hideSnackAlert" });
    }
    if (error) {
      setOffline(true);
    }
  }, [data, loading, error, appDispatch]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const formData = new FormData();
    formData.append("image", files[0]);

    setPhoto(URL.createObjectURL(files[0]));
    setRealPhoto(files);
  };

  const handleCancel = () => {
    setPhoto("");
    if (location.hash === "#feed-post") history.goBack();
  };

  const cleanupDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
  };

  const handleDelete = useCallback(
    (id: string) => {
      const token: string | null = localStorage.getItem("token");

      axios
        .delete(`/api/feed/delete/${id}`, {
          headers: {
            "x-auth-token": `${token}`,
          },
        })
        .then((res) => {
          cleanupDelete(id);
          appDispatch({
            type: "showSnackAlert",
            errorMsg: res.data,
            severity: "success",
          });
        })
        .catch((err) => console.log(err.response.data));
    },
    [appDispatch]
  );

  const observer = React.useRef(
    new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0.1,
      }
    )
  );

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) currentObserver.observe(currentElement);

    return () => {
      currentObserver.disconnect();
    };
  }, [lastElement, observer]);

  const postMedia = posts.map((feedPost, i) => {
    if (posts.length === i + 1) {
      return (
        <div ref={setLastElement} key={feedPost._id}>
          <PostMedia feedPost={feedPost} handleDelete={handleDelete} />
          {hasMore && <PostSkeleton />}
        </div>
      );
    } else {
      return (
        <div key={feedPost._id}>
          <PostMedia feedPost={feedPost} handleDelete={handleDelete} />
        </div>
      );
    }
  });

  const newPosts = newPost.map((incoming) => (
    <PostMedia
      feedPost={incoming}
      handleDelete={handleDelete}
      key={incoming._id}
    />
  ));

  return (
    <div className="feed-container">
      <div className="feed-post-block">
        <Suspense fallback={<div />}>
          {newPosts}
          {postMedia}
        </Suspense>
        {!hasMore && !loading ? (
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
        <PostModal
          isLogged={isLogged}
          user={user}
          setNewPost={setNewPost}
          photo={photo}
          setPhoto={setPhoto}
          isUploading={isUploading}
          onUpload={onUpload}
          offline={offline}
          handleCancel={handleCancel}
          realPhoto={realPhoto}
          setIsUploading={setIsUploading}
        />
      </div>

      {isUploading && (
        <LinearProgress color="primary" className={classes.progress} />
      )}
    </div>
  );
};

export default React.memo(Feed);
