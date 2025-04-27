import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = useLocation().pathname.split("/")[2];
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(["user", userId], () =>
    makeRequest.get("/users/find/" + userId).then((res) => res.data)
  );

  const { isLoading: rIsLoading, data: followersData } = useQuery(
    ["relationship", userId],
    () =>
      makeRequest.get(`/relationships?userId=${userId}`).then((res) => res.data)
  );

  const isFollowing =
    Array.isArray(followersData) &&
    followersData.some((follower) => follower._id === currentUser.id);

  const mutation = useMutation(
    (following) => {
      if (following) {
        return makeRequest.delete("/relationships", {
          params: { followedUserId: userId },
        });
      } else {
        return makeRequest.post("/relationships", {
          followedUserId: userId,
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship", userId]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(isFollowing);
  };

  if (isLoading) return "Loading...";
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={`http://localhost:5000${data.coverPic}`}
          alt="Cover"
          className="cover"
        />
        <img
          src={`http://localhost:5000${data.profilePic}`}
          alt="Profile"
          className="profilePic"
        />
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a
              href="http://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a
              href="http://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon fontSize="large" />
            </a>
            <a
              href="http://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon fontSize="large" />
            </a>
          </div>

          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>

            {rIsLoading ? (
              "Loading followers..."
            ) : userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>

        <Posts userId={userId} />
      </div>

      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
