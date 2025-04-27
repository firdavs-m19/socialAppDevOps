import { useContext, useRef } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const fileRef = useRef();
  const queryClient = useQueryClient();

  // Fetching stories
  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => res.data)
  );

  // Upload file function
  const upload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await makeRequest.post("/upload", formData);
    return res.data;
  };

  // Mutation to create story
  const mutation = useMutation(
    (imgUrl) => makeRequest.post("/stories", { img: imgUrl }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  // Handle file upload and story creation
  const handleAddStory = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imgUrl = await upload(file);
        mutation.mutate(imgUrl);
      } catch (err) {
        console.error("Error uploading or creating story", err);
      }
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={`http://localhost:5000${currentUser.profilePic}`} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => fileRef.current.click()}>+</button>
        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleAddStory}
        />
      </div>

      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;
