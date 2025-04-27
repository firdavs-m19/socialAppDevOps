import { useEffect, useState } from "react";
import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await makeRequest.get(`/posts?userId=${user.id}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (!user) {
    return <div>Please log in to view posts</div>;
  }

  return (
    <div className="posts">
      {error
        ? error
        : loading
        ? "Loading..."
        : posts.length > 0
        ? posts.map((post) => <Post post={post} key={post._id} />)
        : "No posts available."}
    </div>
  );
};

export default Posts;
