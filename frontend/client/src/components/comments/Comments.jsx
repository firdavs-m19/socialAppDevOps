import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments", postId], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments/create", newComment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    if (!desc) return;

    mutation.mutate({
      desc,
      postId,
    });

    setDesc("");
  };

  return (
    <div className="comments">
      {/* Comment input */}
      <div className="write">
        <img
          src={`http://localhost:5000${currentUser.profilePic}`}
          alt={currentUser.name}
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {/* Comments section */}
      {error ? (
        <div>Something went wrong</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        data.map((comment) => (
          <div className="comment" key={comment._id}>
            <img
              src={`http://localhost:5000${comment.userId.profilePic}`}
              alt={comment.userId.name}
            />
            <div className="info">
              <span>{comment.userId.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
