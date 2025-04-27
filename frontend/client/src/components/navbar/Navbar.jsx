import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(currentUser);
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>lamasocial</span>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "8px 16px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            color: "#555",
            cursor: "pointer",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <HomeOutlinedIcon />
          </Link>
          {darkMode ? (
            <WbSunnyOutlinedIcon onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon onClick={toggle} />
          )}
          <GridViewOutlinedIcon />
        </div>
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      {/* mobile toggle */}
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-hamburger">
        <span />
        <span />
        <span />
      </label>

      <div className="right">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "8px 16px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            color: "#555",
            cursor: "pointer",
          }}
        >
          <PersonOutlinedIcon />
          <EmailOutlinedIcon />
          <NotificationsOutlinedIcon />
        </div>
        <div className="user">
          <img src={`http://localhost:5000${currentUser.profilePic}`} alt="" />
          <span>{currentUser.name}</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f0544f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#d8433f";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f0544f";
          }}
        >
          Logout
        </button>{" "}
        {/* Logout Button */}
      </div>
    </div>
  );
};

export default Navbar;
