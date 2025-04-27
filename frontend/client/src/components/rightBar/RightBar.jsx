import "./rightBar.scss";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";

const RightBar = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchRightBarData = async () => {
      try {
        const [suggRes, actRes, onlineRes] = await Promise.all([
          makeRequest.get("users/suggestions"),
          // makeRequest.get("users/activities"),
          // makeRequest.get("users/online"),
        ]);

        setSuggestions(suggRes.data);
        setActivities(actRes.data);
        setOnlineUsers(onlineRes.data);
      } catch (err) {
        if (err.response) {
          console.error("❌ Error Response Data:", err.response.data);
          console.error("❌ Status:", err.response.status);
          console.error("❌ Headers:", err.response.headers);
        } else if (err.request) {
          console.error("❌ Request Made, No Response:", err.request);
        } else {
          console.error("❌ General Error:", err.message);
        }
      }
    };

    fetchRightBarData();
  }, []);

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions */}
        <div className="item">
          <span>Suggestions For You</span>
          {suggestions.map((user) => (
            <div className="user" key={user._id}>
              <div className="userInfo">
                <img
                  src={`http://localhost:5000${
                    user.profilePic || "/default-avatar.png"
                  }`}
                  alt={user.name}
                />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button>follow</button>
              </div>
            </div>
          ))}
        </div>

        {/* Activities */}
        <div className="item">
          <span>Latest Activities</span>
          {activities.map((activity) => (
            <div className="user" key={activity._id}>
              <div className="userInfo">
                <img
                  src={activity.user?.profilePicture || "/default-avatar.png"}
                  alt={activity.user?.name}
                />
                <p>
                  <span>{activity.user?.name}</span> {activity.action}
                </p>
              </div>
              <span>{activity.timeAgo}</span>
            </div>
          ))}
        </div>

        {/* Online Friends */}
        <div className="item">
          <span>Online Friends</span>
          {onlineUsers.map((user) => (
            <div className="user" key={user._id}>
              <div className="userInfo">
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={user.name}
                />
                <div className="online" />
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
