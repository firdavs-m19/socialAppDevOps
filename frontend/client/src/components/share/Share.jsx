import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => makeRequest.post("/posts/create", newPost),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await makeRequest.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        imgUrl = uploadRes.data.img;
      }

      const postData = {
        desc,
        img: imgUrl,
      };

      await makeRequest.post("/posts/create", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDesc("");
      setFile(null);
      queryClient.invalidateQueries(["posts"]);
    } catch (error) {
      console.error(
        "Error creating post:",
        error?.response?.data || error.message
      );
      alert("Failed to create post. Make sure you're logged in.");
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={`http://localhost:5000${currentUser.profilePic}`}
              alt="User"
            />
            <input
              type="text"
              placeholder={`What's on your mind, ${currentUser.name}?`}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="right">
            {file && (
              <img
                className="file"
                src={URL.createObjectURL(file)}
                alt="Selected"
              />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="Add" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="Map" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="Friend" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
