import Feed from "../routes/Feed";
import Home from "../routes/Home";
import NotFound from "../routes/NotFound";
import Profile from "../routes/Profile";
import Settings from "../routes/Settings";
import BottomBar from "./BottomBar";
import FAB from "./buttons/FAB";
import FBButton from "./buttons/FBButton";
import GoogleBtn from "./buttons/GoogleBtn";
import LightSwitch from "./buttons/LightSwitch";
import MenuAppBar from "./MenuAppBar";
import PostModal from "./modals/PostModal";
import Likes from "./modals/Likes";
import Login from "./modals/Login";
import PhotoPreview from "./modals/PhotoPreview";
import PostMedia from "./PostMedia";
import ProfileAvatar from "./ProfileAvatar";
import LikesSkeleton from "./skeletons/LikesSkeleton";
import PostSkeleton from "./skeletons/PostSkeleton";
import ProfileSkeleton from "./skeletons/ProfileSkeleton";
import SnackAlert from "./SnackAlert";
import useWindowDimensions from "./utilities/WindowDimensions";
import AppContext from "../context/AppContext";
import appReducer from "../reducers/appReducer";
import resizeImage from "./utilities/resizeImage";

export {
  Home,
  Profile,
  Feed,
  MenuAppBar,
  SnackAlert,
  BottomBar,
  useWindowDimensions,
  PostMedia,
  PostModal,
  PostSkeleton,
  LikesSkeleton,
  FBButton,
  ProfileAvatar,
  Login,
  PhotoPreview,
  ProfileSkeleton,
  GoogleBtn,
  Settings,
  Likes,
  LightSwitch,
  FAB,
  NotFound,
  AppContext,
  appReducer,
  resizeImage,
};
