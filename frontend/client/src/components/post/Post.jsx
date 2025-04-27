import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./post.scss";

const Post = ({ post }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const postId = post._id;
  const currentUserId = currentUser._id || currentUser.id;

  // Likes
  const { isLoading: likeLoading, data: likes = [] } = useQuery(
    ["likes", postId], // Use postId to make it unique per post
    () => makeRequest.get(`/likes?postId=${postId}`).then((res) => res.data)
  );

  const likeMutation = useMutation(
    (hasLiked) => {
      return hasLiked
        ? makeRequest.delete(`/likes?postId=${postId}`) // Delete like if it exists
        : makeRequest.post("/likes", { postId }); // Add like if it doesn't exist
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes", postId]); // Invalidate only the likes for this specific post
      },
    }
  );

  const handleLike = () => {
    likeMutation.mutate(likes.includes(currentUserId)); // Check if the user already liked this post
  };

  // Delete Post
  const deleteMutation = useMutation(
    () => makeRequest.delete(`/posts/${postId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]); // Invalidate all posts when the current post is deleted
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const user = post.userId || {};
  const isOwner = user._id === currentUserId;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`http://localhost:5000${user.profilePic}`} alt="User" />
            <div className="details">
              <Link
                to={`/profile/${user._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{user.name || "Unknown User"}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && isOwner && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>

        <div className="content">
          <p>{post.desc}</p>
          {post.img && (
            <img src={`http://localhost:5000${post.img}`} alt="Post" />
          )}
        </div>

        <div className="info">
          <div className="item">
            {likeLoading ? (
              "Loading..."
            ) : likes.includes(currentUserId) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            <span>{likes.length} Likes</span>
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
