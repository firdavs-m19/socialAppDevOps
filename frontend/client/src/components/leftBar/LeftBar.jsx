import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import EventIcon from "@mui/icons-material/Event";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MessageIcon from "@mui/icons-material/Message";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={`http://localhost:5000${currentUser.profilePic}`}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <PeopleAltIcon />
            <span>Friends</span>
          </div>
          <div className="item">
            <GroupsIcon />
            <span>Groups</span>
          </div>
          <div className="item">
            <StorefrontIcon />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <LiveTvIcon />
            <span>Watch</span>
          </div>
          <div className="item">
            <HistoryEduIcon />
            <span>Memories</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <EventIcon />
            <span>Events</span>
          </div>
          <div className="item">
            <SportsEsportsIcon />
            <span>Gaming</span>
          </div>
          <div className="item">
            <PhotoLibraryIcon />
            <span>Gallery</span>
          </div>
          <div className="item">
            <PlayCircleOutlineIcon />
            <span>Videos</span>
          </div>
          <div className="item">
            <MessageIcon />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <VolunteerActivismIcon />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <MenuBookIcon />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <SchoolIcon />
            <span>Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
